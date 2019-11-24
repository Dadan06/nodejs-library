import { Client } from '../client/client.model';
import { SaleItem } from '../sale-item/sale-item.model';
import { User } from '../user/user.model';

export enum SaleStatus {
    IN_PROGRESS = 'IN_PROGRESS',
    CANCELED = 'CANCELED',
    TERMINATED = 'TERMINATED'
}

export interface Sale {
    // tslint:disable-next-line: no-any
    _id: any;
    no: number;
    saleDate: Date;
    saleItems: string[] | SaleItem[];
    amount: number;
    discount: number;
    saleStatus: SaleStatus;
    seller: string | User;
    client?: string | Client;
}
