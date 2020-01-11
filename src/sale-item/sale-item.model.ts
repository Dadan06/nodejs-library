import { Product } from '../product/product.model';
import { Incrementation } from '../shared/types/incrementation.interface';

export enum SaleItemStatus {
    ORDERED = 'ORDERED',
    DELETED = 'DELETED',
    CANCELED = 'CANCELED',
    TERMINATED = 'TERMINATED'
}

export interface ChangeQtyPayload {
    saleItem: SaleItem;
    incrementation: Incrementation;
}

export interface SaleItem {
    // tslint:disable-next-line:no-any
    _id: any;
    product: string | Product;
    quantity: number;
    status: SaleItemStatus;
    sale: string;
}
