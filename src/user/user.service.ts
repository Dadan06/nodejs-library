import * as bcrypt from 'bcrypt';
import { ServiceRead } from '../common/service/service-read.interface';
import { ServiceWrite } from '../common/service/service-write.interface';
import { RoleType } from '../role/role.model';
import { HttpStatusCode } from '../shared/constants/http-status-codes.constant';
import { HttpException } from '../shared/types/http-exception.interface';
import { Page, Paginated } from '../shared/types/page.interface';
import { Sort } from '../shared/types/sort.type';
import { getFilteredDocument } from '../shared/utils/filter-paginate.utils';
import { paginate } from '../shared/utils/paginate';
import { User } from './user.model';
import { userRepository } from './user.repository';

export interface PaginatedUser extends Paginated<User> {}

export type FilterFieldMap = Record<string, keyof User>;

const FILTER_FIELDS_MAP: FilterFieldMap = {};
const SEARCH_FIELDS: Array<string> = ['firstname', 'lastname', 'login', 'roleName'];

const DUPLICATE_USER_ERROR = 'Ce login est déja utilisé';

class UserService implements ServiceRead<User>, ServiceWrite<User> {
    async getPaginatedList(
        // tslint:disable-next-line:no-any
        criteria: any,
        page: Page,
        order: Sort<User> = {}
    ): Promise<PaginatedUser> {
        const users: User[] = await getFilteredDocument(
            criteria,
            FILTER_FIELDS_MAP,
            SEARCH_FIELDS,
            userRepository
        )
            .populate('role')
            .where('role.roleType')
            .ne(RoleType.ROOT)
            .exec();
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
            const existingUser: User | null = await userRepository
                .findOne({ login: item.login })
                .exec();
            if (existingUser) {
                throw new HttpException(HttpStatusCode.BAD_REQUEST, DUPLICATE_USER_ERROR);
            }

            const user: User | null = await userRepository.findById(id).exec();
            if (user) {
                item.password = user.password;
            }
        }
        return userRepository.update(id, item);
    }
}

export const userService = new UserService();
