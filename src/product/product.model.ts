import { Supplier } from '../supplier/supplier.model';

export enum Type {
    DATED = 'DATED',
    UNDATED = 'UNDATED'
}

export interface Product {
    // tslint:disable-next-line: no-any
    _id: any;
    name: string;
    costPrice: number;
    sellingPrice: number;
    quantity: number;
    type: Type;
    supplier: string | Supplier;
}
