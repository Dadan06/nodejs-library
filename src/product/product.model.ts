import { Supplier } from '../supplier/supplier.model';

export interface Product {
    // tslint:disable-next-line: no-any
    _id: any;
    name: string;
    costPrice: number;
    sellingPrice: number;
    quantity: number;
    supplier: string | Supplier;
}
