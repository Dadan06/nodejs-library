import { Page, Paginated } from '../../shared/types/page.interface';
import { Sort } from '../../shared/types/sort.type';

export interface ServiceRead<T> {
    getPaginatedList(
        // tslint:disable-next-line:no-any
        criteria: Record<string, any>,
        page: Page,
        order: Sort<T>
    ): Promise<Paginated<T>>;
    getById(id: string): Promise<T | null>;
}
