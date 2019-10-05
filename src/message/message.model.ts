import * as mongoose from 'mongoose';

export interface Message extends mongoose.Document {
    // tslint:disable-next-line: no-any
    _id: any;
    body: string;
    from: string;
    to: string;
    delivered: boolean;
    date: Date;
}
