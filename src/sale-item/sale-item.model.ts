import { Product } from '../product/product.model';

export interface Consignation {
    selled: number;
    returned: number;
    date: Date;
}

export interface SaleItem {
    product: Product;
    quantity: number;
    amount: number;
    consignations: Consignation[];
}
