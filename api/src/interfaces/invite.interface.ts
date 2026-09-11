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

