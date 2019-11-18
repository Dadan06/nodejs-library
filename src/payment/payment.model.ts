import { Sale } from '../sale/sale.model';

export enum PaymentType {
    CASH = 'CASH',
    CONSIGNATION = 'CONSIGNATION'
}

export interface Payment {
    // tslint:disable-next-line: no-any
    _id: any;
    paymentdate: Date;
    sale: Sale | string;
    paymentType: PaymentType;
}
