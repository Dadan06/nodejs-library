import { ServiceRead } from '../common/service/service-read.interface';
import { ServiceWrite } from '../common/service/service-write.interface';
import { SaleStatus, SaleType } from '../sale/sale.model';
import { Page, Paginated } from '../shared/types/page.interface';
import { Sort } from '../shared/types/sort.type';
import { getFilteredWithEmbeddedFields } from '../shared/utils/filter-paginate.utils';
import { paginate } from '../shared/utils/paginate';
import { Payment } from './payment.model';
import { paymentRepository } from './payment.repository';
import { paymentSchema } from './payment.schema';

export interface PaginatedPayment extends Paginated<Payment> {}

const SEARCH_FIELDS: Array<string> = ['sale.client.name', 'sale.seller.login'];

const SALE_POPULATION_STAGES = [
    {
        $lookup: {
            from: 'sales',
            let: { sale: '$sale' },
            as: 'sale',
            pipeline: [
                {
                    $match: { $expr: { $eq: ['$_id', '$$sale'] } }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'seller',
                        foreignField: '_id',
                        as: 'seller'
                    }
                },
                {
                    $unwind: {
                        path: '$seller',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'clients',
                        localField: 'client',
                        foreignField: '_id',
                        as: 'client'
                    }
                },
                {
                    $unwind: {
                        path: '$client',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'saleitems',
                        localField: 'saleItems',
                        foreignField: '_id',
                        as: 'saleItems'
                    }
                }
            ]
        }
    },
    {
        $unwind: {
            path: '$sale',
            preserveNullAndEmptyArrays: true
        }
    }
];

class PaymentService implements ServiceRead<Payment>, ServiceWrite<Payment> {
    async getPaginatedList(
        // tslint:disable-next-line:no-any
        criteria: any,
        page: Page,
        order: Sort<Payment> = {}
    ): Promise<PaginatedPayment> {
        const totalItems: number = await paymentRepository.count(criteria);
        const items: Payment[] = await paymentRepository.getPaginated(criteria, page, order).exec();
        return { items, totalItems };
    }

    async getById(id: string): Promise<Payment | null> {
        return paymentRepository.findById(id).exec();
    }

    async create(item: Payment): Promise<Payment> {
        return paymentRepository.create(item);
    }

    async delete(id: string): Promise<boolean> {
        return paymentRepository.delete(id);
    }

    async update(id: string, item: Payment): Promise<Payment | null> {
        return paymentRepository.update(id, item);
    }

    async getConsignations(
        // tslint:disable-next-line: no-any
        criteria: any,
        page: Page,
        // tslint:disable-next-line: no-any
        order: any
    ): Promise<PaginatedPayment> {
        const payments: Payment[] = await getFilteredWithEmbeddedFields(
            criteria,
            {},
            SEARCH_FIELDS,
            order,
            paymentSchema,
            SALE_POPULATION_STAGES,
            { 'sale.saleType': SaleType.CONSIGNATION, 'sale.saleStatus': SaleStatus.IN_PROGRESS }
        );
        return {
            items: paginate(payments, page),
            totalItems: payments.length
        };
    }
}

export const paymentService = new PaymentService();
