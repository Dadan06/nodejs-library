import { ServiceRead } from '../common/service/service-read.interface';
import { ServiceWrite } from '../common/service/service-write.interface';
import { Page, Paginated } from '../shared/types/page.interface';
import { Sort } from '../shared/types/sort.type';
import { Privilege } from './privilege.model';
import { privilegeRepository } from './privilege.repository';

export interface PaginatedPrivilege extends Paginated<Privilege> {}

class PrivilegeService implements ServiceRead<Privilege>, ServiceWrite<Privilege> {
    async getPaginatedList(
        // tslint:disable-next-line:no-any
        criteria: any,
        page: Page,
        order: Sort<Privilege> = {}
    ): Promise<PaginatedPrivilege> {
        const totalItems: number = await privilegeRepository.count(criteria);
        const items: Privilege[] = await privilegeRepository
            .getPaginated(criteria, page, order)
            .exec();
        return { items, totalItems };
    }

    async getAll(): Promise<Privilege[]> {
        return privilegeRepository.find({}).exec();
    }

    async getById(id: string): Promise<Privilege | null> {
        return privilegeRepository.findById(id).exec();
    }

    async create(item: Privilege): Promise<Privilege> {
        return privilegeRepository.create(item);
    }

    async delete(id: string): Promise<boolean> {
        return privilegeRepository.delete(id);
    }

    async update(id: string, item: Privilege): Promise<Privilege | null> {
        return privilegeRepository.update(id, item);
    }
}

export const privilegeService = new PrivilegeService();
