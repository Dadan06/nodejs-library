import { ServiceRead } from '../common/service/service-read.interface';
import { ServiceWrite } from '../common/service/service-write.interface';
import { Page, Paginated } from '../shared/types/page.interface';
import { Sort } from '../shared/types/sort.type';
import { ConsignationStatus, SaleItem } from './sale-item.model';
import { saleItemRepository } from './sale-item.repository';

export interface PaginatedSaleItem extends Paginated<SaleItem> {}

class SaleItemService implements ServiceRead<SaleItem>, ServiceWrite<SaleItem> {
    async getPaginatedList(
        // tslint:disable-next-line:no-any
        criteria: any,
        page: Page,
        order: Sort<SaleItem> = {}
    ): Promise<PaginatedSaleItem> {
        const totalItems: number = await saleItemRepository.count(criteria);
        const items: SaleItem[] = await saleItemRepository
            .getPaginated(criteria, page, order)
            .exec();
        return { items, totalItems };
    }

    async getById(id: string): Promise<SaleItem | null> {
        let saleItem: SaleItem | null = await saleItemRepository
            .findById(id)
            .lean()
            .exec();
        if (saleItem) {
            saleItem = {
                ...saleItem,
                consignationStatus: this.updateSaleItemConsignationStatus(saleItem)
            };
        }
        return saleItem;
    }

    async create(item: SaleItem): Promise<SaleItem> {
        return saleItemRepository.create(item);
    }

    async delete(id: string): Promise<boolean> {
        return saleItemRepository.delete(id);
    }

    async update(id: string, item: SaleItem): Promise<SaleItem | null> {
        return saleItemRepository.update(id, item);
    }

    updateSaleItemConsignationStatus(saleItem: SaleItem): ConsignationStatus {
        const selled = saleItem.consignations.reduce((acc, current) => acc + +current.selled, 0);
        return saleItem.quantity === selled ? ConsignationStatus.PAID : ConsignationStatus.UNPAID;
    }
}

export const saleItemService = new SaleItemService();
