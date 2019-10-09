import { ServiceRead } from '../common/service/service-read.interface';
import { ServiceWrite } from '../common/service/service-write.interface';
import { HttpStatusCode } from '../shared/constants/http-status-codes.constant';
import { HttpException } from '../shared/types/http-exception.interface';
import { Page, Paginated } from '../shared/types/page.interface';
import { Sort } from '../shared/types/sort.type';
import { getFilteredDocument } from '../shared/utils/filter-paginate.utils';
import { Role, RoleType } from './role.model';
import { roleRepository } from './role.repository';

export interface PaginatedRole extends Paginated<Role> {}

export type FilterFieldMap = Record<string, keyof Role>;

const FILTER_FIELDS_MAP: FilterFieldMap = {};
const SEARCH_FIELDS: Array<string> = ['name'];

const DUPLICATE_ROLE_ERROR = 'Ce rôle existe déjà';

class RoleService implements ServiceRead<Role>, ServiceWrite<Role> {
    async getPaginatedList(
        // tslint:disable-next-line:no-any
        criteria: any,
        page: Page,
        order: Sort<Role> = {}
    ): Promise<PaginatedRole> {
        const totalItems: number = await roleRepository.count(criteria);
        const items: Role[] = await getFilteredDocument(
            criteria,
            FILTER_FIELDS_MAP,
            SEARCH_FIELDS,
            roleRepository
        )
            .where('roleType')
            .ne(RoleType.ROOT)
            .exec();
        return { items, totalItems };
    }

    async getAll(): Promise<Role[]> {
        return roleRepository
            .find({})
            .where('roleType')
            .ne(RoleType.ROOT)
            .exec();
    }

    async getById(id: string): Promise<Role | null> {
        return roleRepository.findById(id).exec();
    }

    async create(item: Role): Promise<Role> {
        const existingRole = await roleRepository.findOne({ name: item.name }).exec();
        if (existingRole) {
            throw new HttpException(HttpStatusCode.BAD_REQUEST, DUPLICATE_ROLE_ERROR);
        }
        return roleRepository.create(item);
    }

    async delete(id: string): Promise<boolean> {
        return roleRepository.delete(id);
    }

    async update(id: string, item: Role): Promise<Role | null> {
        const existingRole = await roleRepository.findOne({ name: item.name }).exec();
        if (existingRole && String(existingRole._id) !== String(item._id)) {
            throw new HttpException(HttpStatusCode.BAD_REQUEST, DUPLICATE_ROLE_ERROR);
        }
        return roleRepository.update(id, item);
    }
}

export const roleService = new RoleService();
