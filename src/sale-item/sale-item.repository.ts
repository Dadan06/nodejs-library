import { BaseRepository } from '../common/repository/base.repository';
import { SaleItem } from './sale-item.model';
import { SaleItemDocument, saleItemSchema } from './sale-item.schema';

class SaleItemRepository extends BaseRepository<SaleItemDocument, SaleItem> {
    constructor() {
        super(saleItemSchema);
    }
}

export const saleItemRepository = new SaleItemRepository();
