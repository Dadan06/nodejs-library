import * as mongoose from 'mongoose';
import { SaleItem, SaleItemStatus } from './sale-item.model';

export interface SaleItemDocument extends SaleItem, mongoose.Document {}

const schema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    amount: { type: Number, required: false },
    status: {
        type: String,
        enum: Object.values(SaleItemStatus),
        required: true
    },
    sale: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true }
});

schema.pre('find', function() {
    this.populate('product');
});

schema.pre('findOne', function() {
    this.populate('product');
});

export const saleItemSchema = mongoose.model<SaleItemDocument>('SaleItem', schema);
