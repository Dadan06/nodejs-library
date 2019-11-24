import * as mongoose from 'mongoose';
import { Sale, SaleStatus } from './sale.model';

export interface SaleDocument extends Sale, mongoose.Document {}

const schema = new mongoose.Schema({
    no: { type: Number, required: true },
    saleDate: { type: Date, required: true },
    saleItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SaleItem', required: true }],
    amount: { type: Number, required: true },
    discount: { type: Number, required: true },
    saleStatus: {
        type: String,
        enum: Object.values(SaleStatus),
        required: true
    },
    seller: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: false }
});

schema.pre('find', function() {
    this.populate('saleItems user client');
});

schema.pre('findOne', function() {
    this.populate('saleItems user client');
});

export const saleSchema = mongoose.model<SaleDocument>('Sale', schema);
