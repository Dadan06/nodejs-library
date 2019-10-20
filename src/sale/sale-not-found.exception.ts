import { HttpException } from '../shared/types/http-exception.interface';

export class SaleNotFoundException extends HttpException {
    constructor(saleId: string) {
        super(404, `Le vente ${saleId} n'existe pas`);
    }
}
