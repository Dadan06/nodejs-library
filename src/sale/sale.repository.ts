import { BaseRepository } from '../common/repository/base.repository';
import { Sale } from './sale.model';
import { SaleDocument, saleSchema } from './sale.schema';

class SaleRepository extends BaseRepository<SaleDocument, Sale> {
    constructor() {
        super(saleSchema);
    }
}

export const saleRepository = new SaleRepository();
