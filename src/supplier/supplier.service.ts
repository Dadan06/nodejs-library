import { ServiceRead } from '../common/service/service-read.interface';
import { ServiceWrite } from '../common/service/service-write.interface';
import { FilterFieldMap } from '../product/product.service';
import { Page, Paginated } from '../shared/types/page.interface';
import { getFilteredWithEmbeddedFields } from '../shared/utils/filter-paginate.utils';
import { paginate } from '../shared/utils/paginate';
import { Supplier } from './supplier.model';
import { supplierRepository } from './supplier.repository';
import { supplierSchema } from './supplier.schema';

export interface PaginatedSupplier extends Paginated<Supplier> {}

const FILTER_FIELDS_MAP: FilterFieldMap = {};
const SEARCH_FIELDS: Array<string> = ['name', 'address', 'contact', 'nif', 'stat', 'cin'];

class SupplierService implements ServiceRead<Supplier>, ServiceWrite<Supplier> {
    async getPaginatedList(
        // tslint:disable-next-line:no-any
        criteria: any,
        page: Page,
        // tslint:disable-next-line: no-any
        order: any
    ): Promise<PaginatedSupplier> {
        const suppliers: Supplier[] = await getFilteredWithEmbeddedFields(
            criteria,
            FILTER_FIELDS_MAP,
            SEARCH_FIELDS,
            order,
            supplierSchema,
            [],
            {}
        );
        return { items: paginate(suppliers, page), totalItems: suppliers.length };
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
