import { ServiceRead } from '../common/service/service-read.interface';
import { ServiceWrite } from '../common/service/service-write.interface';
import { Page, Paginated } from '../shared/types/page.interface';
import { Sort } from '../shared/types/sort.type';
import { getFilteredDocument } from '../shared/utils/filter-paginate.utils';
import { Product } from './product.model';
import { productRepository } from './product.repository';

export interface PaginatedProduct extends Paginated<Product> {}

export type FilterFieldMap = Record<string, keyof Product>;

const FILTER_FIELDS_MAP: FilterFieldMap = {};
const SEARCH_FIELDS: Array<string> = ['name'];

class ProductService implements ServiceRead<Product>, ServiceWrite<Product> {
    async getList(criteria: Partial<Product>): Promise<Partial<Product> | Product[]> {
        return productRepository
            .find(criteria)
            .populate('privileges')
            .exec();
    }

    async getPaginatedList(
        // tslint:disable-next-line:no-any
        criteria: any,
        page: Page,
        order: Sort<Product> = {}
    ): Promise<PaginatedProduct> {
        const totalItems: number = await productRepository.count(criteria);
        const items: Product[] = await getFilteredDocument(
            criteria,
            FILTER_FIELDS_MAP,
            SEARCH_FIELDS,
            productRepository
        )
            .populate('privileges')
            .exec();
        return { items, totalItems };
    }

    async getAll(): Promise<Product[]> {
        return productRepository
            .find({})
            .where('name')
            .ne('Super administrateur')
            .populate('privileges')
            .exec();
    }

    async getById(id: string): Promise<Product | null> {
        return productRepository
            .findById(id)
            .populate('privileges')
            .exec();
    }

    async create(item: Product): Promise<Product> {
        return productRepository.create(item);
    }

    async delete(id: string): Promise<boolean> {
        return productRepository.delete(id);
    }

    async update(id: string, item: Product): Promise<Product | null> {
        return productRepository.update(id, item);
    }
}

export const productService = new ProductService();
