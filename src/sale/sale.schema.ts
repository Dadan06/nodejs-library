import * as mongoose from 'mongoose';
import { Sale, SaleType } from './sale.model';

export interface SaleDocument extends Sale, mongoose.Document {}

const schema = new mongoose.Schema({
    saleType: {
        type: String,
        enum: Object.values(SaleType),
        required: true
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }],
    amount: { type: Number, required: true }
});

schema.pre('find', function() {
    this.populate('products');
});

schema.pre('findOne', function() {
    this.populate('products');
});

export const saleSchema = mongoose.model<SaleDocument>('Sale', schema);
