import type { NextFunction, Request, Response } from "express";
import FamilyService from "../services/family.service";
import { FamilyMapper } from "../mappers/family.mapper";
import type { CreateFamilyDTO, FindFamilyFilters,  } from "../interfaces/family.interface";
import { toInviteResponseDTO, type CreateInviteDTO, type InviteResponseDTO, type UpdateInviteDTO } from "../interfaces/invite.interface";
import DateUtils from "../utils/data.util";
export default class FamilyController {

    static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
            try {
                const family = await FamilyService.create(
                    FamilyMapper.toEntity(req.body as CreateFamilyDTO),
                    req.user!
                );
                res.status(201).json({
                    success: true,
                    ...FamilyMapper.toResponseDTO(family),
                });
            } catch (error) {
                next(error);
            }
    }

    static async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const query = req.query as Record<string, string | undefined>;
            console.log('aqui')
            const filters: FindFamilyFilters = {
                id: query.id,
                name: query.name,

                createdAtFrom: DateUtils.parseLocalDate(query.createdAtFrom),
                createdAtTo: DateUtils.parseLocalDate(query.createdAtTo),

                updatedAtFrom: DateUtils.parseLocalDate(query.updatedAtFrom),
                updatedAtTo: DateUtils.parseLocalDate(query.updatedAtTo),

                createdBy: query.createdBy,

                members: Array.isArray(req.query.members)
                    ? req.query.members as string[]
                    : req.query.members
                        ? [req.query.members as string]
                        : [],
            };
            
            const families =FamilyMapper.toSimpleResponseDTOList(await FamilyService.findMyFamilies(filters, req.user!))

            res.status(200).json ({
                success: true,
                ...families
            })

        } catch (error) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let { id } = req.params

            const family = FamilyMapper.toResponseDTO(await FamilyService.findById(id as string, req.user!))

            res.status(200).json ({
                success: true,
                ...family
            })
        } catch (error) {
            next(error)
        }
    }

    static async createdByMe(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const families = await FamilyService.findByCreator(req.user!);
            res.status(200).json({
                    success: true,
                    families: FamilyMapper.toSimpleResponseDTOList(families),
                });
        } catch (error) {
                next(error);
            }
    }

    static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const actor = req.user!;
            const family = await FamilyService.findFamilyByPersonId(req.params.id as string, actor);
            const updatedFamily = await FamilyService.update(
                family!,
                FamilyMapper.toUpdateEntity(req.body as Partial<CreateFamilyDTO>),
                actor
            );
            res.status(200).json({ success: true, ...FamilyMapper.toResponseDTO(updatedFamily) });
        } catch (error) {
            next(error);
        }
    }

    static async teste(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const family = await FamilyService.findFamilyByPersonId(req.params.id as string, req.user!);
        } catch (error) {
            next(error);
        }
    }
    

    static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const family = await FamilyService.findFamilyByPersonId(req.params.id as string, req.user!);
            await FamilyService.delete(family!, req.user!);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }

    static async createInvite(req: Request, res: Response, next: NextFunction): Promise<void> {
        
        try{
            let { id } = req.params
            const payload = req.body as CreateInviteDTO
            const actor = req.user!;
            let invite: InviteResponseDTO = toInviteResponseDTO( await FamilyService.generateInvite(id as string, payload, actor))
            res.status(201).send(invite)
        }catch (error) {
            next(error);
        }
    }

    static async joinInAFamily(req: Request, res: Response, next: NextFunction): Promise<void> {
        
        try{
            let { token } = req.params
            const { password } = req.body 
            const actor = req.user!;
            const family = await FamilyService.joinInAFamily(token as string,actor,password)
            res.status(201).json({ success: true, ...FamilyMapper.toResponseDTO(family) });
        }catch (error) {
            next(error);
        }
    }

    static async updateInvite(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const invite = await FamilyService.updateInvite(
                req.params.token as string,
                req.body as UpdateInviteDTO,
                req.user!,
            );
            res.status(200).json({ success: true, ...toInviteResponseDTO(invite) });
        } catch (error) {
            next(error);
        }
    }

    static async leave(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const family = await FamilyService.findFamilyByPersonId(req.params.id as string, req.user!);
            await FamilyService.leave(family!, req.user!);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }
}
