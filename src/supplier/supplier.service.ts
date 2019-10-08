import { ServiceRead } from '../common/service/service-read.interface';
import { ServiceWrite } from '../common/service/service-write.interface';
import { Page, Paginated } from '../shared/types/page.interface';
import { Sort } from '../shared/types/sort.type';
import { Supplier } from './supplier.model';
import { supplierRepository } from './supplier.repository';

export interface PaginatedSupplier extends Paginated<Supplier> {}

class SupplierService implements ServiceRead<Supplier>, ServiceWrite<Supplier> {
    async getPaginatedList(
        // tslint:disable-next-line:no-any
        criteria: any,
        page: Page,
        order: Sort<Supplier> = {}
    ): Promise<PaginatedSupplier> {
        const totalItems: number = await supplierRepository.count(criteria);
        const items: Supplier[] = await supplierRepository
            .getPaginated(criteria, page, order)
            .exec();
        return { items, totalItems };
    }

    async getAll(): Promise<Supplier[]> {
        return supplierRepository.find({}).exec();
    }

    async getById(id: string): Promise<Supplier | null> {
        return supplierRepository.findById(id).exec();
    }

    async create(item: Supplier): Promise<Supplier> {
        return supplierRepository.create(item);
    }

    async delete(id: string): Promise<boolean> {
        return supplierRepository.delete(id);
    }

    async update(id: string, item: Supplier): Promise<Supplier | null> {
        return supplierRepository.update(id, item);
    }
}

export const supplierService = new SupplierService();
