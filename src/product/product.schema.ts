import * as mongoose from 'mongoose';
import { Product } from './product.model';

export interface ProductDocument extends Product, mongoose.Document {}

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    costPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    quantity: {type: Number, required: true},
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' }
});

export const productSchema = mongoose.model<ProductDocument>('Product', schema);
