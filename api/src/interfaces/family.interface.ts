export interface FamilyInterface {
    name: string
}

export interface FamilyFilters {
    id?: string,
    name?: string ,
    createdByMe?: boolean,
    createdAtFrom?: Date;
    createdAtTo?: Date;

    updatedAtFrom?: Date;
    updatedAtTo?: Date;

    memberName?: string;

    simpleResponse?: boolean;
}