import { BaseRepository } from '../common/repository/base.repository';
import { User } from './user.model';
import { UserDocument, userSchema } from './user.schema';

class UserRepository extends BaseRepository<UserDocument, User> {
    ROLE_POPULATION_STAGE = [
        {
            $lookup: {
                from: 'roles',
                localField: 'role',
                foreignField: '_id',
                as: 'role',
            },
        },
        {
            $unwind: {
                path: '$role',
                preserveNullAndEmptyArrays: true,
            },
        },
    ];

    constructor() {
        super(userSchema);
    }
}

export const userRepository = new UserRepository();
