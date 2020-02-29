import * as bcrypt from 'bcrypt';
import { ServiceRead } from '../common/service/service-read.interface';
import { ServiceWrite } from '../common/service/service-write.interface';
import { RoleType } from '../role/role.model';
import { HttpStatusCode } from '../shared/constants/http-status-codes.constant';
import { HttpException } from '../shared/types/http-exception.interface';
import { Page, Paginated } from '../shared/types/page.interface';
import { getFilteredWithEmbeddedFields } from '../shared/utils/filter-paginate.utils';
import { paginate } from '../shared/utils/paginate';
import { User } from './user.model';
import { userRepository } from './user.repository';
import { userSchema } from './user.schema';

export interface PaginatedUser extends Paginated<User> {}

export type FilterFieldMap = Record<string, keyof User>;

const SEARCH_FIELDS: Array<string> = ['firstname', 'lastname', 'login', 'role.name'];

const DUPLICATE_USER_ERROR = 'Ce login est déja utilisé';

const ROLE_POPULATION_STAGE = [
    {
        $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'role'
        }
    },
    {
        $unwind: {
            path: '$role',
            preserveNullAndEmptyArrays: true
        }
    }
];

class UserService implements ServiceRead<User>, ServiceWrite<User> {
    async getPaginatedList(
        // tslint:disable-next-line:no-any
        criteria: any,
        page: Page,
        // tslint:disable-next-line: no-any
        order: any
    ): Promise<PaginatedUser> {
        const users: User[] = await getFilteredWithEmbeddedFields(
            criteria,
            {},
            SEARCH_FIELDS,
            order,
            userSchema,
            ROLE_POPULATION_STAGE,
            { 'role.roleType': { $ne: RoleType.ROOT } }
        );
        return {
            items: paginate(users, page),
            totalItems: users.length
        };
    }

    async getById(id: string): Promise<User | null> {
        return userRepository
            .findById(id)
            .populate({ path: 'role', populate: { path: 'privileges' } })
            .exec();
    }

    async create(item: User): Promise<User> {
        const existingUser: User | null = await userRepository
            .findOne({ login: item.login })
            .exec();
        if (existingUser) {
            throw new HttpException(HttpStatusCode.BAD_REQUEST, DUPLICATE_USER_ERROR);
        }
        return userRepository.create(item);
    }

    async delete(id: string): Promise<boolean> {
        return userRepository.delete(id);
    }

    async update(id: string, item: User): Promise<User | null> {
        if (item.password) {
            item.password = await bcrypt.hash(item.password, 10);
        } else {
            const user: User | null = await userRepository.findById(item._id).exec();
            if (user) {
                item.password = user.password;
            }
        }
        return userRepository.update(id, item);
    }
}

export const userService = new UserService();
