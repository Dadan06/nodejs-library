import * as mongoose from 'mongoose';
import { Role } from './role.model';

export interface RoleDocument extends Role, mongoose.Document {}

const schema = new mongoose.Schema({
    name: String,
    privileges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Privilege' }]
});

schema.pre('find', function() {
    this.populate('privileges');
});

schema.pre('findOne', function() {
    this.populate('privileges');
});

export const roleSchema = mongoose.model<RoleDocument>('Role', schema);
