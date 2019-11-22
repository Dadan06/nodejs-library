import { Sale } from '../sale/sale.model';

export enum PaymentType {
    CASH = 'CASH',
    CONSIGNATION = 'CONSIGNATION'
}

export interface Payment {
    // tslint:disable-next-line: no-any
    _id: any;
    paymentDate: Date;
    amount: number;
    sale: Sale | string;
    paymentType: PaymentType;
}
