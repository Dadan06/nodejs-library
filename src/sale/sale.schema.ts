import * as mongoose from 'mongoose';
import { Sale, SaleStatus, SaleType } from './sale.model';

export interface SaleDocument extends Sale, mongoose.Document {}

const consignationSchema = new mongoose.Schema({
    selled: Number,
    left: Number
});

const saleItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
});

const schema = new mongoose.Schema({
    no: { type: Number, required: true },
    saleDate: { type: Date, required: true },
    saleItems: [saleItemSchema],
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
    consignations: [consignationSchema],
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }
});

const fieldsToPopulate = 'saleItems.product user client';

schema.pre('find', function() {
    this.populate(fieldsToPopulate);
});

schema.pre('findOne', function() {
    this.populate(fieldsToPopulate);
});

export const saleSchema = mongoose.model<SaleDocument>('Sale', schema);
