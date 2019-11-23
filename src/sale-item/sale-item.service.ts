import { ServiceRead } from '../common/service/service-read.interface';
import { ServiceWrite } from '../common/service/service-write.interface';
import { ProductNotFoundException } from '../product/product-not-found.exception';
import { Product } from '../product/product.model';
import { productRepository } from '../product/product.repository';
import { HttpStatusCode } from '../shared/constants/http-status-codes.constant';
import { HttpException } from '../shared/types/http-exception.interface';
import { Page, Paginated } from '../shared/types/page.interface';
import { Sort } from '../shared/types/sort.type';
import { SaleItemNotFoundException } from './sale-item-not-found.exception';
import { SaleItem, SaleItemStatus } from './sale-item.model';
import { saleItemRepository } from './sale-item.repository';

export interface PaginatedSaleItem extends Paginated<SaleItem> {}

class SaleItemService implements ServiceRead<SaleItem>, ServiceWrite<SaleItem> {
    async getPaginatedList(
        // tslint:disable-next-line:no-any
        criteria: any,
        page: Page,
        order: Sort<SaleItem> = {}
    ): Promise<PaginatedSaleItem> {
        const totalItems: number = await saleItemRepository.count(criteria);
        const items: SaleItem[] = await saleItemRepository
            .getPaginated(criteria, page, order)
            .exec();
        return { items, totalItems };
    }

    async getById(id: string): Promise<SaleItem | null> {
        return saleItemRepository.findById(id).exec();
    }

    async create(item: SaleItem): Promise<SaleItem> {
        return saleItemRepository.create(item);
    }

    async delete(id: string): Promise<boolean> {
        return saleItemRepository.delete(id);
    }

    async update(id: string, item: SaleItem): Promise<SaleItem | null> {
        return saleItemRepository.update(id, item);
    }

    async deleteItem(id: string, saleItem: SaleItem): Promise<SaleItem | null> {
        const product: Product | null = saleItem.product
            ? await productRepository.findById((saleItem.product as Product)._id).exec()
            : null;
        if (!product) {
            throw new ProductNotFoundException((saleItem.product as Product)._id);
        }
        product.quantity += saleItem.quantity;
        productRepository.update(product._id, product);
        await saleItemRepository.update(id, { ...saleItem, status: SaleItemStatus.DELETED });
        return saleItemRepository.findById(id).exec();
    }

    async changeQty(saleItem: SaleItem): Promise<SaleItem> {
        const saleItemDb: SaleItem | null = await saleItemRepository.findById(saleItem._id).exec();
        if (!saleItemDb) {
            throw new SaleItemNotFoundException(saleItem._id);
        }
        const saleItemProduct = saleItemDb.product as Product;
        if (saleItemProduct.quantity < saleItem.quantity) {
            throw new HttpException(HttpStatusCode.GONE, 'Quantité insuffisante');
        }
        await saleItemRepository.update(saleItemDb._id, saleItem);
        return saleItem;
    }

    async incrementQty(saleItem: SaleItem): Promise<SaleItem> {
        const saleItemDb: SaleItem | null = await saleItemRepository.findById(saleItem._id).exec();
        if (!saleItemDb) {
            throw new SaleItemNotFoundException(saleItem._id);
        }
        const saleItemProduct = saleItemDb.product as Product;
        if (saleItemProduct.quantity === 0) {
            throw new HttpException(HttpStatusCode.GONE, 'Quantité insuffisante');
        }
        saleItemDb.quantity += 1;
        await saleItemRepository.update(saleItemDb._id, saleItemDb);
        await productRepository.update(saleItemProduct._id, {
            quantity: saleItemProduct.quantity - 1
        });
        return saleItemDb;
    }

    async decrementQty(saleItem: SaleItem): Promise<SaleItem> {
        const saleItemDb: SaleItem | null = await saleItemRepository.findById(saleItem._id).exec();
        if (!saleItemDb) {
            throw new SaleItemNotFoundException(saleItem._id);
        }
        saleItemDb.quantity -= 1;
        const saleItemProduct = saleItemDb.product as Product;
        await saleItemRepository.update(saleItemDb._id, saleItemDb);
        await productRepository.update(saleItemProduct._id, {
            quantity: saleItemProduct.quantity + 1
        });
        return saleItemDb;
    }
}

export const saleItemService = new SaleItemService();
