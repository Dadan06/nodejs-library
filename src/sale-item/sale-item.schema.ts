import * as mongoose from 'mongoose';
import { productSchema } from '../product/product.schema';
import { SaleItem } from './sale-item.model';

export interface SaleItemDocument extends SaleItem, mongoose.Document {}

const consignationSchema = new mongoose.Schema({
    selled: Number,
    left: Number,
    date: Date
});

const schema = new mongoose.Schema({
    product: productSchema,
    quantity: { type: Number, required: true },
    amount: { type: Number, required: true },
    consignations: [consignationSchema]
});

export const saleItemSchema = mongoose.model<SaleItemDocument>('SaleItem', schema);
