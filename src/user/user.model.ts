import * as mongoose from 'mongoose';
import { Role } from '../role/role.model';

export interface User extends mongoose.Document {
    // tslint:disable-next-line:no-any
    _id: any;
    firstname: string;
    lastname: string;
    login: string;
    password: string;
    role: Role | string;
    validPassword: (p: string) => Promise<boolean>;
}
