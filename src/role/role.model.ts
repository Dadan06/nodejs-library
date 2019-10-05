import { ObjectId } from 'mongodb';
import { Privilege } from '../privilege/privilege.model';

export interface Role {
    // tslint:disable-next-line: no-any
    _id: any;
    name: string;
    privileges: Privilege[] | ObjectId[];
}
