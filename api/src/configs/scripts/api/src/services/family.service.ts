import FamilyRepository from "../repositories/family.repository";
import { Family } from '../models/family.model';
import { User } from "../models/user.models";
import { Person } from "../models/person.model";
import { AppError } from "../models/error.model";
import InviteRepository from "../repositories/invite.repository";
import SecurityService from "./security.service";
import type { CreateInviteDTO, Invite, InviteResponseDTO, UpdateInviteDTO } from "../interfaces/invite.interface";
import { toInviteResponseDTO}  from "../interfaces/invite.interface";
import type { FindFamilyFilters } from '../interfaces/family.interface';
import { Validator } from "../utils/validator.utils";


export class FamilyService {
    constructor(
        private readonly familyRepository: FamilyRepository,
        private readonly inviteRepository: InviteRepository,
        private readonly securityService: SecurityService
    ) {}

    async create(family: Family, user: User): Promise<Family> {
        family.validateForCreate();
        const person = user.requirePerson("family", "create")
        family.createdBy = person;
        family.updatedAt = null;
        
        // validacao para que nao exista doas familias com o mesmo nome para o mesmo usuario
        let filter: FindFamilyFilters = {
            name: family.name as string,
            createdBy: user.person.id
        }
        let existName = await this.getByFilters(filter)

        if (existName.length > 0) {
            AppError.badRequest(
                "family", 
                "findMyFamilies", 
                `Família já existente com esse nome`, 
                `${family.name}`
            );
        }

        const createdFamily = await this.familyRepository.create(family);

        await this.addMember(createdFamily, person);
        return this.getById(createdFamily.id);
    }

    private async getByFilters(filters: FindFamilyFilters): Promise<Family[]> {
        const families = await this.familyRepository.findByFilters(filters)
        return families
    }

    async findMyFamilies (filters: FindFamilyFilters, user: User): Promise<Family[]> {
        if(!user.userIsAdmin()) {
            const person = user.requirePerson("family", "findMyFamilies")
            filters.userMemberId = person.id;
        }

        const families = await this.getByFilters(filters)
        if (families.length === 0) {
            AppError.notFound(
                "family", 
                "findMyFamilies", 
                `Usuário de id ${user.id} inválido ou sem família`, 
            );
        }

        return families
    }

    private async getById(id: string): Promise<Family> {
        const family = await this.familyRepository.findById(id);
        if (!family) {
            AppError.notFound(
                "family", 
                "getById", 
                'família não existente ou inválida', 
            );
        }
        return family;
    }

    async findFamilyByPersonId(id: string, user: User): Promise<Family> {
        const family = await this.getById(id);
        const person = user.requirePerson("family", "findByIdForUser");

        const isMember = await this.familyRepository.personBelongsToFamily(
            family.id,
            person.id
        );

        if (!isMember) {
            throw new AppError(
                "family",
                "findByIdForUser",
                "Você não faz parte desta família.",
                403
            );
        }

        return family;
    }

    async findById(id: string, user: User): Promise<Family> {
        if (!Validator.isUUUID(id)) {
            AppError.badRequest(
                "person", 
                "getById", 
                "ID inválido.", 
            );
        }

        let filter: FindFamilyFilters = {
            id: id as string
        }

        if (!user.userIsAdmin()) {
            filter.createdBy =  user.person.id
            filter.members = [user.person.id];
        }

        const families = await this.familyRepository.findByFilters(filter)
        const family = families[0];
        if (!family) {
            AppError.notFound(
                "family",
                "getById",
                "Família não existente ou inválida"
            );
        }

        return family
    }

    async findByCreator(user: User): Promise<Family[]> {
        const person = user.requirePerson("family", "findByCreator");
        const family = this.familyRepository.findByCreator(person.id);
        if (!family) {
            if (!family) {
            AppError.notFound(
                "family", 
                "getById", 
                'família não existente ou inválida',
            );
        } 
        }
        return family
    }

    async update(family: Family, changes: Family, user: User): Promise<Family> {
        this.assertCreator(family, user);
        if (changes.name === undefined) {
            throw new AppError("family", "update", "Informe ao menos um campo para atualizar.", 400);
        }

        family.name = changes.name;
        family.validateForUpdate();
        return this.familyRepository.update(family.id, { name: family.name });
    }

    async delete(family: Family, user: User): Promise<void> {
        this.assertCreator(family, user);
        await this.familyRepository.delete(family.id);
    }

    private assertCreator(family: Family, user: User): void {
        const person = user.requirePerson("family", "access");
        if (family.createdBy.id !== person.id) {
            AppError.validation(
                "family", 
                "access",
                "Você não pode alterar esta família.",
                403
            );
        }
    }

    private async addMember(family: Family, person: Person): Promise<void> {
        await this.familyRepository.addMember(family.id, person.id);
    }

    async generateInvite(
        familyId: string,
        data: CreateInviteDTO,
        user: User
    ): Promise<InviteResponseDTO> {

        const family = await this.getById(familyId)
        if (family.createdBy.id !== user.person.id) {
            AppError.forbidden(
                "family", 
                "generateInvite", 
                "Úsuario sem permissao para acessar essa familia, contate o administrador!"
            );
        }

        const existingInvite = await this.inviteRepository.findByFamilyId(family.id);

        if (existingInvite) {
            AppError.conflict(
                'family',
                'generateInveite',
                "Já existe um convite para esta família.", 
                existingInvite.token
            );
        }

        this.validateInviteLimits(data.maxUses, data.expiresInHours);

        const token = this.securityService.generateTokenInvite()

        const password = data.password == null
            ? null
            : await this.securityService.hash(data.password);

        let invite: Invite = {
            token,
            familyId: family.id,
            maxUses: data.maxUses,
            usedCount: 1,
            active: true,
            password,
            expiresAt: new Date(
                Date.now() + data.expiresInHours * 60 * 60 * 1000
            ),
            createdAt: new Date()
        };

        await this.inviteRepository.create(invite);

        return invite;
    }

    async updateInvite(token: string, data: UpdateInviteDTO, user: User): Promise<InviteResponseDTO> {
        const invite = await this.inviteRepository.findByToken(token);
        if (!invite) throw new AppError("family", "updateInvite", "Convite não encontrado", 404);

        const family = await this.getById(invite.familyId);
        this.assertCreator(family, user);

        const hasPassword = data.password !== undefined;
        const hasMaxUses = data.maxUses !== undefined;
        const hasExpiresInHours = data.expiresInHours !== undefined;
        const hasActive = data.active !== undefined;
        if (!hasPassword && !hasMaxUses && !hasExpiresInHours && !hasActive) {
            throw new AppError("family", "updateInvite", "Informe ao menos um campo para atualizar.", 400);
        }
        if (hasMaxUses) this.validateMaxUses(data.maxUses!, invite.usedCount);
        if (hasExpiresInHours) this.validateExpiresInHours(data.expiresInHours!);

        const changes: Partial<Invite> = {};
        if (hasPassword) changes.password = data.password == null ? null : await this.securityService.hash(data.password);
        if (hasMaxUses) changes.maxUses = data.maxUses!;
        if (hasExpiresInHours) changes.expiresAt = new Date(Date.now() + data.expiresInHours! * 60 * 60 * 1000);
        if (hasActive) changes.active = data.active!;

        await this.inviteRepository.update(token, changes);
        return toInviteResponseDTO({ ...invite, ...changes });
    }

    async joinInAFamily(token: string, user: User, password: string): Promise<Family> {
        const validToken = await this.inviteRepository.findByToken(token)
        if (!validToken) {
            throw new AppError(
                'family',
                'join',
                'Convite inválido',
                404
            )
        }

        if (!validToken.active) {
            throw new AppError(
                'family',
                'join',
                'Convite inativo',
                400
            )
        }

        if (validToken.expiresAt.getTime() <= Date.now()) {
            throw new AppError(
                'family',
                'join',
                'Este convite expirou.',
                400
            );
        }
        if (validToken.usedCount >= validToken.maxUses) {
            throw new AppError(
                'family',
                'join',
                'Esta família atingiu o limite máximo de membros cadastrados!',
                400
            )
        }
        const invitePassword = validToken.password;
        if (invitePassword != null) {
            const isSamePassword = await this.securityService.verify(password, invitePassword);
            if (!isSamePassword) {
                 throw new AppError(
                'family',
                'join',
                'senha invalida',
                400
            );
            }
        }
        const family = await this.getById(validToken.familyId);
        const person = user.requirePerson("family", "join");
        if (family.members.some((member) => member.id === person.id)) {
            throw new AppError("family", "join", "Você já faz parte desta família.", 409);
        }

        await this.addMember(family, person);
        const usedCount = validToken.usedCount + 1;
        await this.inviteRepository.update(token, {
            usedCount,
            ...(usedCount >= validToken.maxUses ? { active: false } : {}),
        });
        return this.getById(family.id);
    }

    async leave(family: Family, user: User): Promise<void> {
        const person = user.requirePerson("family", "leave");
        if (!family.members.some((member) => member.id === person.id)) {
            throw new AppError("family", "leave", "Você não faz parte desta família.", 400);
        }
        await this.familyRepository.removeMember(family.id, person.id);
    }

    private validateInviteLimits(maxUses: number, expiresInHours: number): void {
        this.validateMaxUses(maxUses);
        this.validateExpiresInHours(expiresInHours);
    }

    private validateMaxUses(maxUses: number, minimum = 1): void {
        if (!Number.isInteger(maxUses) || maxUses < minimum) {
            AppError.validation(
                "family", 
                "invite", 
                `maxUses deve ser um número inteiro maior ou igual a ${minimum}.`, 
                400
            );
        }
    }

    private validateExpiresInHours(expiresInHours: number): void {
        if (!Number.isFinite(expiresInHours) || expiresInHours <= 0) {
            AppError.validation(
                "family", 
                "invite",
                "expiresInHours deve ser maior que zero.", 
                400
            );
        }
    }
}

export default new FamilyService(new FamilyRepository(), new InviteRepository(), new SecurityService());
