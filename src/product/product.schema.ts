import * as mongoose from 'mongoose';
import { Product, Type } from './product.model';

export interface ProductDocument extends Product, mongoose.Document {}

export const productSchema = new mongoose.Schema({
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

productSchema.pre('findOne', function() {
    this.populate(fieldsToPopulate);
});

productSchema.pre('find', function() {
    this.populate(fieldsToPopulate);
});

export const productModel = mongoose.model<ProductDocument>('Product', productSchema);
