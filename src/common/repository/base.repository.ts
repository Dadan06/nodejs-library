import * as mongoose from 'mongoose';
import { Page } from '../../shared/types/page.interface';
import { Sort } from '../../shared/types/sort.type';
import { RepositoryRead } from './repository-read.interface';
import { RepositoryWrite } from './repository-write.interface';

export abstract class BaseRepository<T extends mongoose.Document, U>
    implements RepositoryRead<T, U>, RepositoryWrite<T, U> {
    private readonly model: mongoose.Model<T>;

    constructor(schemaModel: mongoose.Model<T>) {
        this.model = schemaModel;
    }

    // tslint:disable-next-line:no-any
    find(conditions: any): mongoose.DocumentQuery<T[], T> {
        return this.model.find(conditions);
    }

    // tslint:disable-next-line:no-any
    getPaginated(conditions: any, page: Page, order: Sort<U>): mongoose.DocumentQuery<T[], T> {
        return this.find(conditions)
            .sort(order)
            .skip((page.page - 1) * page.pageSize)
            .limit(page.pageSize);
    }

    // tslint:disable-next-line:no-any
    count(conditions: any): Promise<number> {
        return this.model.count(conditions).exec();
    }

    findById(id: string): mongoose.DocumentQuery<T | null, T> {
        return this.model.findById(id);
    }

    findOne(conditions: Partial<T>): mongoose.DocumentQuery<T | null, T> {
        return this.model.findOne(conditions);
    }

    create(item: Partial<U>): Promise<T> {
        return this.model.create(item);
    }

    delete(id: string): Promise<boolean> {
        return this.model.deleteOne({ _id: id }).then(() => true);
    }

    update(id: string, item: Partial<U>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, item, { new: true }).exec();
    }
}
