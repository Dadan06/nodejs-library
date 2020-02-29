import { ServiceRead } from '../common/service/service-read.interface';
import { ServiceWrite } from '../common/service/service-write.interface';
import { Page, Paginated } from '../shared/types/page.interface';
import {
    checkDuplicate,
    getFilteredWithEmbeddedFields
} from '../shared/utils/filter-paginate.utils';
import { Role, RoleType } from './role.model';
import { roleRepository } from './role.repository';
import { roleSchema } from './role.schema';

export interface PaginatedRole extends Paginated<Role> {}

export type FilterFieldMap = Record<string, keyof Role>;

const FILTER_FIELDS_MAP: FilterFieldMap = {};
const SEARCH_FIELDS: Array<string> = ['name'];

class RoleService implements ServiceRead<Role>, ServiceWrite<Role> {
    async getPaginatedList(
        // tslint:disable-next-line:no-any
        criteria: any,
        page: Page,
        // tslint:disable-next-line: no-any
        order: any
    ): Promise<PaginatedRole> {
        const totalItems: number = await roleRepository.count(criteria);
        const items: Role[] = await getFilteredWithEmbeddedFields(
            criteria,
            FILTER_FIELDS_MAP,
            SEARCH_FIELDS,
            order,
            roleSchema,
            [],
            {
                roleType: { $ne: RoleType.ROOT }
            }
        );
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
        return roleRepository.create(item);
    }

    async delete(id: string): Promise<boolean> {
        return roleRepository.delete(id);
    }

    async update(id: string, item: Role): Promise<Role | null> {
        return roleRepository.update(id, item);
    }

    async checkDuplicate(role: Role): Promise<boolean> {
        return checkDuplicate(roleRepository, 'name', role);
    }
}

export const roleService = new RoleService();
