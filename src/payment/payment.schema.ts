import * as mongoose from 'mongoose';
import { Payment, PaymentType } from './payment.model';

export interface PaymentDocument extends Payment, mongoose.Document {}

const schema = new mongoose.Schema({
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    paymentType: {
        type: String,
        enum: Object.values(PaymentType),
        required: true
    },
    sale: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true }
});

schema.pre('find', function() {
    this.populate('sale');
});

schema.pre('findOne', function() {
    this.populate('sale');
});

export const paymentSchema = mongoose.model<PaymentDocument>('Payment', schema);
