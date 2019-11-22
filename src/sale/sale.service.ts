import { ServiceRead } from '../common/service/service-read.interface';
import { Payment, PaymentType } from '../payment/payment.model';
import { paymentRepository } from '../payment/payment.repository';
import { ProductNotFoundException } from '../product/product-not-found.exception';
import { Product } from '../product/product.model';
import { productRepository } from '../product/product.repository';
import { SaleItemNotFoundException } from '../sale-item/sale-item-not-found.exception';
import { SaleItem, SaleItemStatus } from '../sale-item/sale-item.model';
import { saleItemRepository } from '../sale-item/sale-item.repository';
import { HttpStatusCode } from '../shared/constants/http-status-codes.constant';
import { HttpException } from '../shared/types/http-exception.interface';
import { Page, Paginated } from '../shared/types/page.interface';
import { Sort } from '../shared/types/sort.type';
import { User } from '../user/user.model';
import { SaleNotFoundException } from './sale-not-found.exception';
import { Sale, SaleStatus } from './sale.model';
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

    async create(user: User): Promise<Sale> {
        const no = (await this.getSaleCount()) + 1;
        return saleRepository.create({
            no,
            saleStatus: SaleStatus.IN_PROGRESS,
            saleItems: [],
            saleDate: new Date(),
            seller: user,
            amount: 0
        });
    }

    async getSaleCount() {
        return saleRepository.count({});
    }

    async addProduct(saleId: string, product: Product): Promise<SaleItem> {
        const sale: Sale | null = await saleRepository.findById(saleId).exec();
        if (!sale) {
            throw new SaleNotFoundException(saleId);
        }
        const dbProduct: Product | null = await productRepository.findById(product._id).exec();
        if (!dbProduct) {
            throw new HttpException(HttpStatusCode.NOT_FOUND, `Ce produit n'existe pas`);
        }
        this.ensureStockIsEnough(dbProduct, 1);
        if (dbProduct) {
            await productRepository.update(product._id, { quantity: product.quantity - 1 });
        }
        const saleItem: SaleItem = await saleItemRepository
            // tslint:disable-next-line: no-object-literal-type-assertion
            .create({
                status: SaleItemStatus.ORDERED,
                product: dbProduct,
                quantity: 1,
                sale: sale._id
            })
            .then(item => item.populate('product').execPopulate());
        sale.saleItems.push(saleItem._id);
        await saleRepository.update(sale._id, sale);
        return saleItem;
    }

    async cancelSale(saleId: string): Promise<Sale | null> {
        const sale: Sale | null = await saleRepository.update(saleId, {
            saleStatus: SaleStatus.CANCELED
        });
        if (!sale) {
            throw new SaleNotFoundException(saleId);
        }
        await saleItemRepository.cancelForSale(saleId);
        for (const id of sale.saleItems) {
            const saleItem: SaleItem | null = await saleItemRepository
                .findById((id as unknown) as string)
                .exec();
            if (!saleItem) {
                throw new SaleItemNotFoundException((id as unknown) as string);
            }
            const dbProduct: Product | null = await productRepository
                .findById((saleItem.product as Product)._id)
                .exec();
            if (!dbProduct) {
                throw new ProductNotFoundException((saleItem.product as Product)._id);
            }
            dbProduct.quantity += saleItem.quantity;
            await productRepository.update(dbProduct._id, dbProduct);
        }
        return sale;
    }

    async saveSale(item: Sale): Promise<Payment> {
        const amount = this.calculateSaleAmount(item);
        return paymentRepository.create({
            amount,
            paymentDate: new Date(),
            paymentType: PaymentType.CASH,
            sale: item._id
        });
    }

    private ensureStockIsEnough(product: Product | null, quantity: number) {
        if (!(product && product.quantity)) {
            throw new HttpException(
                HttpStatusCode.GONE,
                `Ce produit n'est plus disponible en stock`
            );
        }
        if (product && product.quantity < quantity) {
            throw new HttpException(HttpStatusCode.GONE, `Quantité disponible insuffisante`);
        }
    }

    private calculateSaleAmount(sale: Sale): number {
        const saleItems: SaleItem[] = (sale.saleItems as SaleItem[]).filter(
            o => o.status === SaleItemStatus.ORDERED
        );
        return saleItems.reduce((m, saleItem) => {
            const product = saleItem.product as Product;
            return m + product.sellingPrice * product.quantity;
        }, 0);
    }
}

export const saleService = new SaleService();
