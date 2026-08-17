import { AppDataSource, initializeDatabase } from "./data-base";
import mongo from "./mongo";
import RegistrationService from "../services/registration.service";
import FamilyService from "../services/family.service";
import FamilyRepository from "../repositories/family.repository";
import { Family } from "../models/family.model";
import { Person } from "../models/person.model";
import { User } from "../models/user.models";

const DEFAULT_USER_COUNT = 10;
const MEMBERS_PER_FAMILY = 5;
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

async function clearDatabases(): Promise<void> {
    await AppDataSource.query(
        'TRUNCATE TABLE "person_families", "families", "persons", "users" RESTART IDENTITY CASCADE',
    );
    await mongo.getDatabase().dropDatabase();
    console.log("🧹 PostgreSQL e MongoDB limpos.");
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

async function createFamilies(users: User[]): Promise<number> {
    const familyRepository = new FamilyRepository();
    let createdFamilies = 0;

    for (let start = 0; start < users.length; start += MEMBERS_PER_FAMILY) {
        const members = users.slice(start, start + MEMBERS_PER_FAMILY);
        const owner = members[0];
        if (!owner) continue;

        const family = Object.assign(new Family(), {
            name: `Família Dev ${createdFamilies + 1}`,
        });
        const createdFamily = await FamilyService.create(family, owner);

        for (const member of members.slice(1)) {
            await familyRepository.addMember(createdFamily.id, member.person.id);
        }
        createdFamilies += 1;
    }

    return createdFamilies;
}

async function seed(): Promise<void> {
    const userCount = getUserCount(process.argv.slice(2));
    await initializeDatabase();
    await mongo.connect();

    try {
        await clearDatabases();
        const users = await createUsers(userCount);
        const familyCount = await createFamilies(users);
        console.log(`🎉 Seed finalizada: ${users.length} usuários e ${familyCount} famílias.`);
    } finally {
        await mongo.close();
        await AppDataSource.destroy();
    }
}

seed().catch((error: unknown) => {
    console.error("❌ Erro ao executar a seed:", error);
    process.exitCode = 1;
});
