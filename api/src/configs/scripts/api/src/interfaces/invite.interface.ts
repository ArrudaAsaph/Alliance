export interface Invite {
    token: string;
    familyId: string;
    password?: string | null;
    maxUses: number;
    usedCount: number;
    expiresAt: Date;
    createdAt: Date;
    active: boolean;
}

export interface InviteResponseDTO {
    token: string;
    familyId: string;
    maxUses: number;
    usedCount: number;
    expiresAt: Date;
    createdAt: Date;
    active: boolean;
}

export interface CreateInviteDTO {
    password?: string | null;
    maxUses: number;
    expiresInHours: number;
}

export interface UpdateInviteDTO {
    password?: string | null;
    maxUses?: number;
    expiresInHours?: number;
    active?: boolean;
}


export function toInviteResponseDTO(invite: Invite): InviteResponseDTO {
    return {
        token: invite.token,
        familyId: invite.familyId,
        maxUses: invite.maxUses,
        usedCount: invite.usedCount,
        active: invite.active,
        expiresAt: invite.expiresAt,
        createdAt: invite.createdAt,
    };
}
