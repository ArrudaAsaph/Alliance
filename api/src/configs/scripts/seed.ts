import { User } from "../../models/user.model";
import RegistrationService from "../../services/registration.service";
import { Person } from "../../models/person.model";
import { AppDataSource, initializeDatabase } from "../data-base";
import { clearDatabase } from "./clear-database";

const DEFAULT_USER_COUNT = 10;
const PASSWORD = "Senha123!";

function getUserCount(args: string[]): number {
    const value = args.find((arg) => /^\d+$/.test(arg));
    if (!value) return DEFAULT_USER_COUNT;

    const count = Number(value);
    if (!Number.isSafeInteger(count) || count <= 0) {
        throw new Error("A quantidade de usuários deve ser um número inteiro maior que zero.");
    }
    return count;
}

async function createUsers(count: number): Promise<User[]> {
    const users: User[] = [];
    for (let index = 1; index <= count; index += 1) {
        const user = Object.assign(new User(), {
            username: `user${index}_dev`,
            email: `user${index}@dev.com`,
            password: PASSWORD,
        });
        const person = Object.assign(new Person(), {
            firstName: `User${index}`,
            lastName: "Dev",
            birthday: null,
        });
        users.push(await RegistrationService.create(user, person, PASSWORD));
    }
    return users;
}

async function seed(): Promise<void> {
    const userCount = getUserCount(process.argv.slice(2));
    await clearDatabase({ destroyConnection: false });
    await initializeDatabase();
    

    try {
        const users = await createUsers(userCount);
        
        console.log(`🎉 Seed finalizada: ${users.length} usuários`);
    } finally {
        await AppDataSource.destroy();
    }
}

seed().catch((error: unknown) => {
    console.error("❌ Erro ao executar a seed:", error);
    process.exitCode = 1;
});
