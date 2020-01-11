import { HttpStatusCode } from '../shared/constants/http-status-codes.constant';
import { HttpException } from '../shared/types/http-exception.interface';

export class SaleItemQtyOutOfRangeException extends HttpException {
    constructor() {
        super(HttpStatusCode.BAD_REQUEST, 'Quantite insuffisante');
    }
}
