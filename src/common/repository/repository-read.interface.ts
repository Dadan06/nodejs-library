import * as mongoose from 'mongoose';
import { Page } from '../../shared/types/page.interface';
import { Sort } from '../../shared/types/sort.type';

export interface RepositoryRead<T extends mongoose.Document, U> {
    // tslint:disable-next-line:no-any
    find(conditions: any): mongoose.DocumentQuery<T[], T>;
    // tslint:disable-next-line:no-any
    getPaginated(conditions: any, page: Page, order: Sort<U>): mongoose.DocumentQuery<T[], T>;
    // tslint:disable-next-line:no-any
    count(conditions: any): Promise<number>;
    findById(id: string): mongoose.DocumentQuery<T | null, T>;
    findOne(condition: Partial<T>): mongoose.DocumentQuery<T | null, T>;
}
