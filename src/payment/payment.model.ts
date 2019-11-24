import { Sale } from '../sale/sale.model';

export interface Payment {
    // tslint:disable-next-line: no-any
    _id: any;
    paymentDate: Date;
    amount: number;
    sale: Sale | string;
}
