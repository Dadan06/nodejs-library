import { Product } from '../product/product.model';

export enum SaleItemStatus {
    ORDERED = 'ORDERED',
    DELETED = 'DELETED',
    CANCELED = 'CANCELED',
    TERMINATED = 'TERMINATED'
}

export interface QuantityChangingData {
    previousValue: number;
    saleItem: SaleItem;
}

export interface SaleItem {
    // tslint:disable-next-line:no-any
    _id: any;
    product: string | Product;
    quantity: number;
    status: SaleItemStatus;
    sale: string;
}
