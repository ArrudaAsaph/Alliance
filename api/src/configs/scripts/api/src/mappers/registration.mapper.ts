import { UserMapper } from "./user.mapper";
import { PersonMapper } from "./person.mapper";
import type { CreateRegistrationDTO, CreateUserDTO } from "../interfaces/user.interface";
export class RegistrationMapper {

    static toEntity(dto: CreateRegistrationDTO) {
        let userDto = dto as CreateUserDTO
        UserMapper.toEntity(userDto)
        
    }

}
