import { BaseRepository } from '../common/repository/base.repository';
import { SaleItem, SaleItemStatus } from './sale-item.model';
import { SaleItemDocument, saleItemSchema } from './sale-item.schema';

class SaleItemRepository extends BaseRepository<SaleItemDocument, SaleItem> {
    constructor() {
        super(saleItemSchema);
    }

    async cancelForSale(saleId: string): Promise<void> {
        saleItemSchema
            .updateMany(
                { sale: saleId },
                {
                    status: SaleItemStatus.CANCELED
                }
            )
            .exec();
    }
}

export const saleItemRepository = new SaleItemRepository();
