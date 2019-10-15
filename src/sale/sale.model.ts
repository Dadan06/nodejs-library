import { Product } from '../product/product.model';

export enum SaleType {
    DIRECT_SALE = 'DIRECT SALE',
    CONSIGNATION = 'CONSIGNATION'
}

export interface Sale {
    // tslint:disable-next-line: no-any
    _id: any;
    type: SaleType;
    products: string[] | Product[];
    amount: number;
}
