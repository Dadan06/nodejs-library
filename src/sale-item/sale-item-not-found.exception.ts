import { HttpException } from '../shared/types/http-exception.interface';

export class SaleItemNotFoundException extends HttpException {
    constructor(saleItemId: string) {
        super(404, `Le contenu ${saleItemId} n'existe pas`);
    }
}
