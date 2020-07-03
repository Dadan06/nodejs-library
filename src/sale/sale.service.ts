import { ServiceRead } from '../common/service/service-read.interface';
import { Payment } from '../payment/payment.model';
import { paymentRepository } from '../payment/payment.repository';
import { productRepository } from '../product/product.repository';
import { SaleItem } from '../sale-item/sale-item.model';
import { saleItemRepository } from '../sale-item/sale-item.repository';
import { HttpStatusCode } from '../shared/constants/http-status-codes.constant';
import { HttpException } from '../shared/types/http-exception.interface';
import { Page, Paginated } from '../shared/types/page.interface';
import { Sort } from '../shared/types/sort.type';
import { Sale, SaleStatus, SaleType } from './sale.model';
import { saleRepository } from './sale.repository';

export interface PaginatedSale extends Paginated<Sale> {}

class SaleService implements ServiceRead<Sale> {
    async getPaginatedList(
        // tslint:disable-next-line:no-any
        criteria: any,
        page: Page,
        order: Sort<Sale> = {}
    ): Promise<PaginatedSale> {
        const totalItems: number = await saleRepository.count(criteria);
        const items: Sale[] = await saleRepository.getPaginated(criteria, page, order).exec();
        return { items, totalItems };
    }

    async getById(id: string): Promise<Sale | null> {
        return saleRepository.findById(id).exec();
    }

    async delete(id: string): Promise<boolean> {
        return saleRepository.delete(id);
    }

    async update(id: string, item: Sale): Promise<Sale | null> {
        return saleRepository.update(id, item);
    }

    async saveSale(item: Sale): Promise<Payment> {
        await this.ensureEachProductQuantityEnough(item.saleItems as SaleItem[]);
        await this.updateProductQuantity(item.saleItems as SaleItem[]);
        const saleItems = await this.createSaleItems(item.saleItems as SaleItem[]);
        const sale: Sale = await saleRepository.create({
            ...item,
            _id: undefined,
            no: (await this.count()) + 1,
            saleItems,
            saleStatus:
                item.saleType === SaleType.DIRECT_SALE
                    ? SaleStatus.TERMINATED
                    : SaleStatus.IN_PROGRESS,
        });
        return paymentRepository.create({
            amount: item.amount,
            paymentDate: new Date(),
            sale,
        });
    }

    private async count(): Promise<number> {
        return saleRepository.count({});
    }

    private async ensureEachProductQuantityEnough(saleItems: SaleItem[]): Promise<void> {
        for (const saleItem of saleItems) {
            if (saleItem.quantity > saleItem.product.quantity) {
                throw new HttpException(
                    HttpStatusCode.BAD_REQUEST,
                    `Quantite insuffisante pour le produit "${saleItem.product.name}"`
                );
            }
        }
    }

    private async createSaleItems(items: SaleItem[]): Promise<SaleItem[]> {
        const saleItems = [];
        for (const saleItem of items) {
            const createdSaleItem = await saleItemRepository.create(saleItem);
            saleItems.push(createdSaleItem);
        }
        return saleItems;
    }

    private async updateProductQuantity(saleItems: SaleItem[]): Promise<void> {
        for (const saleItem of saleItems) {
            await productRepository.update(saleItem.product._id, {
                quantity: saleItem.product.quantity - saleItem.quantity,
            });
        }
    }
}

export const saleService = new SaleService();
