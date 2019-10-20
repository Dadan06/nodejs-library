import { SaleItem } from '../sale-item/sale-item.model';
import { User } from '../user/user.model';

export enum SaleStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    CANCELED = 'CANCELED',
    TERMINATED = 'TERMINATED'
}

export enum SaleType {
    DIRECT_SALE = 'DIRECT_SALE',
    CONSIGNATION = 'CONSIGNATION'
}

export interface Sale {
    // tslint:disable-next-line: no-any
    _id: any;
    no: number;
    saleType: SaleType;
    saleDate: Date;
    saleItems: string[] | SaleItem[];
    amount: number;
    saleStatus: SaleStatus;
    seller: string | User;
}
