import { clientRepository } from '../client/client.repository';
import { PaginatedSale, Sale, SaleFilterUpdates, SaleStatus } from '../sale/sale.model';
import { saleRepository } from '../sale/sale.repository';
import { saleSchema } from '../sale/sale.schema';
import { Page } from '../shared/types/page.interface';
import {
    FilterUpdateConfig,
    getFilteredWithEmbeddedFields,
    initFilterUpdatesUsingMultipleRepository,
    setFilterUpdatesCounts
} from '../shared/utils/filter-paginate.utils';
import { paginate } from '../shared/utils/paginate';
import { userRepository } from '../user/user.repository';

export const SELLER_POPULATION_STAGES = [
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
    }
];

export const CLIENTS_POPULATION_STAGES = [
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
    }
];

export type SaleFilterFieldMap = Record<string, string>;

export const SALE_FILTER_FIELDS_MAP: SaleFilterFieldMap = {
    clients: 'client.name',
    sellers: 'seller.login',
    types: 'saleType'
};

const getOrderFilterUpdateConfigs = (): FilterUpdateConfig[] => [
    {
        filter: 'clients',
        repository: clientRepository,
        criteria: {},
        field: 'name'
    },
    {
        filter: 'sellers',
        repository: userRepository,
        criteria: {},
        field: 'login'
    },
    {
        filter: 'types',
        repository: saleRepository,
        criteria: {},
        field: 'saleType'
    }
];

export const SEARCH_FIELDS = ['client.name', 'seller.login'];

class SaleMonitoringService {
    // tslint:disable-next-line: no-any
    async getSales(criteria: any, page: Page): Promise<PaginatedSale> {
        const populateStages = [...CLIENTS_POPULATION_STAGES, ...SELLER_POPULATION_STAGES];
        const sales: Sale[] = await getFilteredWithEmbeddedFields(
            criteria,
            SALE_FILTER_FIELDS_MAP,
            SEARCH_FIELDS,
            saleSchema,
            populateStages,
            {
                saleStatus: SaleStatus.TERMINATED,
                saleDate: {
                    $gte: new Date(criteria.from),
                    $lte: new Date(criteria.to)
                }
            }
        );
        const filterUpdates = await initFilterUpdatesUsingMultipleRepository(
            getOrderFilterUpdateConfigs()
        );
        setFilterUpdatesCounts(filterUpdates, sales, SALE_FILTER_FIELDS_MAP, {
            clients: {},
            sellers: {},
            types: {}
        });
        return {
            filter: filterUpdates as SaleFilterUpdates,
            items: paginate(sales, page),
            totalItems: sales.length
        };
    }
}

export const saleMonitoringService = new SaleMonitoringService();
