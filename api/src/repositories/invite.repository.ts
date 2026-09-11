import mongo from "../configs/mongo-data-base"
import type { Invite } from "../interfaces/invite.interface";

export default class InviteRepository {
    private get collection() {
        return mongo.getDatabase().collection<Invite>("invites");
    }

    async create(invite: Invite) {
        return this.collection.insertOne(invite);
    }

    async findByToken(token: string) {
        return this.collection.findOne({ token });
    }

    async update(token: string, invite: Partial<Invite>) {
        return this.collection.updateOne(
            { token },
            { $set: invite }
        );
    }

    async findByFamilyId(familyId: string) {
        return this.collection.findOne({ familyId });
    }

    async delete(token: string) {
        return this.collection.deleteOne({ token });
    }
}