import { BaseRepository } from '../common/repository/base.repository';
import { Supplier } from './supplier.model';
import { SupplierDocument, supplierSchema } from './supplier.schema';

class SupplierRepository extends BaseRepository<SupplierDocument, Supplier> {
    constructor() {
        super(supplierSchema);
    }
}

export const supplierRepository = new SupplierRepository();
