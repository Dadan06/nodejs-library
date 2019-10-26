import * as mongoose from 'mongoose';
import { Client, ClientType } from './client.model';

export interface ClientDocument extends Client, mongoose.Document {}

const schema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    clientType: {
        type: String,
        enum: Object.values(ClientType),
        required: true
    }
});

export const clientSchema = mongoose.model<ClientDocument>('Client', schema);
