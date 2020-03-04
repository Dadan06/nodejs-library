import * as mongoose from 'mongoose';
import { Sale, SaleStatus, SaleType } from './sale.model';

export interface SaleDocument extends Sale, mongoose.Document {}

const schema = new mongoose.Schema({
    no: { type: Number, required: true },
    saleDate: { type: Date, required: true },
    saleItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SaleItem' }],
    amount: { type: Number, required: true },
    discount: { type: Number, required: true },
    saleStatus: {
        type: String,
        enum: Object.values(SaleStatus),
        required: true
    },
    saleType: {
        type: String,
        enum: Object.values(SaleType),
        required: false
    },
    seller: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }
});

const fieldsToPopulate = 'saleItems user client';

schema.pre('find', function() {
    this.populate(fieldsToPopulate);
});

schema.pre('findOne', function() {
    this.populate(fieldsToPopulate);
});

export const saleSchema = mongoose.model<SaleDocument>('Sale', schema);
