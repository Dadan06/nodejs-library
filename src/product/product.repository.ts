import { BaseRepository } from '../common/repository/base.repository';
import { Product } from './product.model';
import { ProductDocument, productModel } from './product.schema';

class ProductRepository extends BaseRepository<ProductDocument, Product> {
    constructor() {
        super(productModel);
    }
}

export const productRepository = new ProductRepository();
