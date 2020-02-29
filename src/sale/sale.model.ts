import { Client } from '../client/client.model';
import { Product } from '../product/product.model';
import { FilterItem } from '../shared/types/filter-item.interface';
import { Paginated } from '../shared/types/page.interface';
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

export interface Consignation {
    selled: number;
    returned: number;
    date: Date;
}

export interface Sale {
    // tslint:disable-next-line: no-any
    _id: any;
    no: number;
    saleDate: Date;
    saleItems: SaleItem[];
    amount: number;
    discount: number;
    saleStatus: SaleStatus;
    saleType: SaleType;
    seller: string | User;
    consignations?: Consignation[];
    client?: string | Client;
}

export interface SaleFilterUpdates extends Record<string, FilterItem[]> {
    clients: FilterItem[];
    sellers: FilterItem[];
}

export interface PaginatedSale extends Paginated<Sale> {
    filter: SaleFilterUpdates | null;
}

export interface SaleItem {
    product: string | Product;
    quantity: number;
}
