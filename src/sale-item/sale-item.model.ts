import { Product } from '../product/product.model';

export enum SaleItemStatus {
    ORDERED = 'ORDERED',
    DELETED = 'DELETED'
}

export interface SaleItem {
    // tslint:disable-next-line:no-any
    _id: any;
    product: string | Product;
    quantity: number;
    amount?: number;
    status: SaleItemStatus;
    sale: string;
}
