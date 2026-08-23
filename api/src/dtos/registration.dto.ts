import type { PersonInterface } from '../interfaces/person.interface';
import type { CreateUserDTO } from './user.dto';

export interface CreateRegistrationDTO {
    user: CreateUserDTO,
    person: PersonInterface
}