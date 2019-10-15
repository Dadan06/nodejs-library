import { ServiceRead } from '../common/service/service-read.interface';
import { ServiceWrite } from '../common/service/service-write.interface';
import { Page, Paginated } from '../shared/types/page.interface';
import { Sort } from '../shared/types/sort.type';
import { Sale } from './sale.model';
import { saleRepository } from './sale.repository';

export interface PaginatedSale extends Paginated<Sale> {}

class SaleService implements ServiceRead<Sale>, ServiceWrite<Sale> {
    async getPaginatedList(
        // tslint:disable-next-line:no-any
        criteria: any,
        page: Page,
        order: Sort<Sale> = {}
    ): Promise<PaginatedSale> {
        const totalItems: number = await saleRepository.count(criteria);
        const items: Sale[] = await saleRepository.getPaginated(criteria, page, order).exec();
        return { items, totalItems };
    }

    async getById(id: string): Promise<Sale | null> {
        return saleRepository.findById(id).exec();
    }

    async create(item: Sale): Promise<Sale> {
        return saleRepository.create(item);
    }

    async delete(id: string): Promise<boolean> {
        return saleRepository.delete(id);
    }

    async update(id: string, item: Sale): Promise<Sale | null> {
        return saleRepository.update(id, item);
    }
}

export const saleService = new SaleService();
