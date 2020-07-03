import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { User } from './user.model';

export interface UserDocument extends User, mongoose.Document {}

const schema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    login: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    socketId: {
        type: String,
    },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
});

schema.pre<User>('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

schema.methods.validPassword = function (this: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

export const userSchema = mongoose.model<User>('User', schema);
