import { ServiceRead } from '../common/service/service-read.interface';
import { Payment } from '../payment/payment.model';
import { paymentRepository } from '../payment/payment.repository';
import { Product } from '../product/product.model';
import { productRepository } from '../product/product.repository';
import { HttpStatusCode } from '../shared/constants/http-status-codes.constant';
import { HttpException } from '../shared/types/http-exception.interface';
import { Page, Paginated } from '../shared/types/page.interface';
import { Sort } from '../shared/types/sort.type';
import { Sale, SaleItem, SaleStatus, SaleType } from './sale.model';
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
        await this.ensureEachProductQuantityEnough(item.saleItems);
        await this.updateProductQuantity(item.saleItems);
        const sale: Sale = await saleRepository.create({
            ...item,
            _id: undefined,
            no: (await this.count()) + 1,
            saleStatus:
                item.saleType === SaleType.DIRECT_SALE
                    ? SaleStatus.TERMINATED
                    : SaleStatus.IN_PROGRESS
        });
        return paymentRepository.create({
            amount: item.amount,
            paymentDate: new Date(),
            sale
        });
    }

    private async count(): Promise<number> {
        return saleRepository.count({});
    }

    private async ensureEachProductQuantityEnough(saleItems: SaleItem[]): Promise<void> {
        for (const saleItem of saleItems) {
            const product: Product = saleItem.product as Product;
            if (saleItem.quantity > product.quantity) {
                throw new HttpException(
                    HttpStatusCode.BAD_REQUEST,
                    `Quantite insuffisante pour le produit "${product.name}"`
                );
            }
        }
    }

    private async updateProductQuantity(saleItems: SaleItem[]): Promise<void> {
        for (const saleItem of saleItems) {
            const product: Product = saleItem.product as Product;
            await productRepository.update(product._id, {
                quantity: product.quantity - saleItem.quantity
            });
        }
    }
}

export const saleService = new SaleService();
