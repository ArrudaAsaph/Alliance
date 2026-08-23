export interface PersonInterface {
    firstName?: string,
    lastName?: string,
    birthday?: Date | null,
}

export interface PersonFilters {
    id?: string,
    firstName?: string ,
    lastName?: string,
    createdAtFrom?: Date;
    createdAtTo?: Date;

    updatedAtFrom?: Date;
    updatedAtTo?: Date;

    birthdayFrom?: Date;
    birthdayTo?: Date;

    simpleResponse?: boolean;
}