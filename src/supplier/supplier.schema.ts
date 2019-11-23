import * as mongoose from 'mongoose';
import { Supplier } from './supplier.model';

export interface SupplierDocument extends Supplier, mongoose.Document {}

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    nif: { type: String, required: false },
    stat: { type: String, required: false },
    cin: { type: String, required: false },
    address: { type: String, required: true },
    contact: { type: String, required: true }
});

export const supplierSchema = mongoose.model<SupplierDocument>('Supplier', schema);
