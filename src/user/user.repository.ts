import { BaseRepository } from '../common/repository/base.repository';
import { User } from './user.model';
import { UserDocument, userSchema } from './user.schema';

class UserRepository extends BaseRepository<UserDocument, User> {
    constructor() {
        super(userSchema);
    }
}

export const userRepository = new UserRepository();
