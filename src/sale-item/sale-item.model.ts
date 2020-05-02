import { Product } from '../product/product.model';

export enum ConsignationStatus {
    PAID = 'PAID',
    UNPAID = 'UNPAID'
}

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
    consignationStatus?: ConsignationStatus;
}
