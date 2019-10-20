import * as mongoose from 'mongoose';
import { Sale, SaleStatus, SaleType } from './sale.model';

export interface SaleDocument extends Sale, mongoose.Document {}

const schema = new mongoose.Schema({
    no: { type: Number, required: true },
    saleType: {
        type: String,
        enum: Object.values(SaleType),
        required: true
    },
    saleDate: { type: Date, required: true },
    saleItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SaleItem', required: true }],
    amount: { type: Number, required: true },
    saleStatus: {
        type: String,
        enum: Object.values(SaleStatus),
        required: true
    },
    seller: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }]
});

schema.pre('find', function() {
    this.populate('saleItems');
    this.populate('user');
});

schema.pre('findOne', function() {
    this.populate('saleItems');
    this.populate('user');
});

export const saleSchema = mongoose.model<SaleDocument>('Sale', schema);
