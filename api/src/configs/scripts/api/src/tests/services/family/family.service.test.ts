import assert from "node:assert/strict";
import test from "node:test";
import { FamilyService } from "../../../services/family.service";
import type FamilyRepository from "../../../repositories/family.repository";
import type InviteRepository from "../../../repositories/invite.repository";
import type SecurityService from "../../../services/security.service";

test("FamilyService armazena o hash da senha informada no convite", async () => {
    let savedInvite: { password?: string | null } | undefined;
    let hashedPassword: string | undefined;

    const familyRepository = {
        findById: async () => ({ id: "family-id", createdBy: { id: "person-id" } }),
    };
    const inviteRepository = {
        findByFamilyId: async () => null,
        create: async (invite: { password?: string | null }) => { savedInvite = invite; },
    };
    const securityService = {
        generateTokenInvite: () => "invite-token",
        hash: async (password: string) => {
            hashedPassword = password;
            return `hash:${password}`;
        },
    };
    const service = new FamilyService(
        familyRepository as unknown as FamilyRepository,
        inviteRepository as unknown as InviteRepository,
        securityService as unknown as SecurityService,
    );

    await service.generateInvite(
        "family-id",
        { password: "Segredo123", maxUses: 5, expiresInHours: 24 },
        { id: "owner-id", person: { id: "person-id" } } as never,
    );

    assert.equal(hashedPassword, "Segredo123");
    assert.equal(savedInvite?.password, "hash:Segredo123");
});

test("FamilyService inclui o criador como membro da família", async () => {
    const family = { id: "family-id", createdBy: { id: "person-id" }, members: [] };
    let member: [string, string] | undefined;
    const service = new FamilyService(
        {
            create: async () => family,
            findById: async () => family,
            addMember: async (familyId: string, personId: string) => { member = [familyId, personId]; },
        } as unknown as FamilyRepository,
        {} as InviteRepository,
        {} as SecurityService,
    );

    await service.create({ validateForCreate: () => undefined } as never, {
        id: "owner-id",
        person: { id: "person-id" },
    } as never);

    assert.deepEqual(member, ["family-id", "person-id"]);
});

test("FamilyService adiciona quem entra, consome o convite e retorna a família", async () => {
    const family = { id: "family-id", createdBy: { id: "person-id" }, members: [] };
    let member: [string, string] | undefined;
    let inviteChanges: object | undefined;
    const service = new FamilyService(
        {
            findById: async () => family,
            addMember: async (familyId: string, personId: string) => { member = [familyId, personId]; },
        } as unknown as FamilyRepository,
        {
            findByToken: async () => ({ token: "token", familyId: "family-id", maxUses: 1, usedCount: 0, active: true, password: null, expiresAt: new Date(Date.now() + 60_000), createdAt: new Date() }),
            update: async (_token: string, changes: object) => { inviteChanges = changes; },
        } as unknown as InviteRepository,
        {} as SecurityService,
    );

    const result = await service.joinInAFamily("token", {
        id: "user-id",
        person: { id: "person-id" },
    } as never, "");

    assert.equal(result, family);
    assert.deepEqual(member, ["family-id", "person-id"]);
    assert.deepEqual(inviteChanges, { usedCount: 1, active: false });
});

test("FamilyService remove usuário e perfil quando sai da família", async () => {
    const family = { id: "family-id", members: [{ id: "person-id" }] };
    let removed: [string, string] | undefined;
    const service = new FamilyService(
        {
            removeMember: async (familyId: string, personId: string) => { removed = [familyId, personId]; },
        } as unknown as FamilyRepository,
        {} as InviteRepository,
        {} as SecurityService,
    );

    await service.leave(family as never, { id: "user-id", person: { id: "person-id" } } as never);

    assert.deepEqual(removed, ["family-id", "person-id"]);
});

test("FamilyService permite ao criador atualizar um convite", async () => {
    let changes: object | undefined;
    const service = new FamilyService(
        { findById: async () => ({ id: "family-id", createdBy: { id: "person-id" }, members: [] }) } as unknown as FamilyRepository,
        {
            findByToken: async () => ({ token: "token", familyId: "family-id", maxUses: 5, usedCount: 1, active: true, password: null, expiresAt: new Date(), createdAt: new Date() }),
            update: async (_token: string, data: object) => { changes = data; },
        } as unknown as InviteRepository,
        { hash: async (password: string) => `hash:${password}` } as unknown as SecurityService,
    );

    const invite = await service.updateInvite("token", { maxUses: 8, password: "NovaSenha" }, { id: "owner-id", person: { id: "person-id" } } as never);

    assert.deepEqual(changes, { maxUses: 8, password: "hash:NovaSenha" });
    assert.equal(invite.maxUses, 8);
});
