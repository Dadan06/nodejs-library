import { HttpException } from '../shared/types/http-exception.interface';

export class ProductNotFoundException extends HttpException {
    constructor(productId: string) {
        super(404, `Le produit ${productId} n'existe pas`);
    }
}
