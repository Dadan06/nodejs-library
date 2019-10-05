import { BaseRepository } from '../common/repository/base.repository';
import { Product } from './product.model';
import { ProductDocument, productSchema } from './product.schema';

class ProductRepository extends BaseRepository<ProductDocument, Product> {
    constructor() {
        super(productSchema);
    }
}

export const productRepository = new ProductRepository();
