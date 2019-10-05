import { BaseRepository } from '../common/repository/base.repository';
import { User } from './user.model';
import { UserDocument, userSchema } from './user.schema';

class UserRepository extends BaseRepository<UserDocument, User> {
    constructor() {
        super(userSchema);
    }

    async getSocketOwnerId(socketId: string): Promise<string | null> {
        const user = await this.findOne({ socketId }).exec();
        return user && user._id;
    }

    async getSocketId(userId: string): Promise<string | null> {
        const user = await this.findById(userId).exec();
        return user && user.socketId;
    }
}

export const userRepository = new UserRepository();
