export interface UserInterface {
    username: string,
    email: string,
    password: string,
}

export interface UserFilters {
    id?: string,
    username?: string ,
    email?: string,
    createdAtFrom?: Date;
    createdAtTo?: Date;

    updatedAtFrom?: Date;
    updatedAtTo?: Date;

    lastLoginFrom?: Date;
    lastLoginTo?: Date;
    isAdmin?: boolean

    simpleResponse?: boolean;
}