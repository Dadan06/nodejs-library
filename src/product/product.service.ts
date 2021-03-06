import { ServiceRead } from '../common/service/service-read.interface';
import { ServiceWrite } from '../common/service/service-write.interface';
import { Page, Paginated } from '../shared/types/page.interface';
import {
    checkDuplicate,
    getFilteredWithEmbeddedFields
} from '../shared/utils/filter-paginate.utils';
import { Product } from './product.model';
import { productRepository } from './product.repository';
import { productModel } from './product.schema';

export interface PaginatedProduct extends Paginated<Product> {}

export type FilterFieldMap = Record<string, keyof Product>;

const FILTER_FIELDS_MAP: FilterFieldMap = {};
const SEARCH_FIELDS: Array<string> = ['name', 'supplier.name'];

const SUPPLIER_POPULATION_STAGE = [
    {
        $lookup: {
            from: 'suppliers',
            localField: 'supplier',
            foreignField: '_id',
            as: 'supplier'
        }
    },
    {
        $unwind: {
            path: '$supplier',
            preserveNullAndEmptyArrays: true
        }
    }
];

class ProductService implements ServiceRead<Product>, ServiceWrite<Product> {
    async getPaginatedList(
        // tslint:disable-next-line:no-any
        criteria: any,
        page: Page,
        // tslint:disable-next-line: no-any
        order: any
    ): Promise<PaginatedProduct> {
        const totalItems: number = await productRepository.count(criteria);
        const items: Product[] = await getFilteredWithEmbeddedFields(
            criteria,
            {},
            SEARCH_FIELDS,
            order,
            productModel,
            SUPPLIER_POPULATION_STAGE
        );
        return { items, totalItems };
    }

    async getAll(): Promise<Product[]> {
        return productRepository.find({}).exec();
    }

    async getById(id: string): Promise<Product | null> {
        return productRepository
            .findById(id)
            .populate('supplier')
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

    async checkDuplicate(product: Product): Promise<boolean> {
        return checkDuplicate(productRepository, 'name', product);
    }
}

export const productService = new ProductService();
