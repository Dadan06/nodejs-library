import * as mongoose from 'mongoose';
import { Product, Type } from './product.model';

export interface ProductDocument extends Product, mongoose.Document {}

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    type: {
        type: String,
        enum: Object.values(Type),
        required: true
    },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }
});

const fieldsToPopulate = 'supplier';

schema.pre('findOne', function() {
    this.populate(fieldsToPopulate);
});

schema.pre('find', function() {
    this.populate(fieldsToPopulate);
});

export const productSchema = mongoose.model<ProductDocument>('Product', schema);
