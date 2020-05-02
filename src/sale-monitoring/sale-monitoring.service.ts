import { clientRepository } from '../client/client.repository';
import { PaginatedSale, Sale, SaleFilterUpdates, SaleStatus } from '../sale/sale.model';
import { saleRepository } from '../sale/sale.repository';
import { saleSchema } from '../sale/sale.schema';
import { saleService } from '../sale/sale.service';
import { Page } from '../shared/types/page.interface';
import {
    buildPeriodCriteria,
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

export const SALEITEMS_POPULATION_STAGES = [
    {
        $lookup: {
            from: 'saleitems',
            localField: 'saleItems',
            foreignField: '_id',
            as: 'saleItems'
        }
    }
];

export type SaleFilterFieldMap = Record<string, string>;

export const SALE_FILTER_FIELDS_MAP: SaleFilterFieldMap = {
    clientTypes: 'client.type',
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
    },
    {
        filter: 'clientTypes',
        repository: clientRepository,
        criteria: {},
        field: 'type'
    }
];

export const SEARCH_FIELDS = ['client.name', 'seller.login'];

class SaleMonitoringService {
    // tslint:disable-next-line: no-any
    async getSales(criteria: any, page: Page, order: any): Promise<PaginatedSale> {
        const populateStages = [
            ...CLIENTS_POPULATION_STAGES,
            ...SELLER_POPULATION_STAGES,
            ...SALEITEMS_POPULATION_STAGES
        ];
        const sales: Sale[] = await getFilteredWithEmbeddedFields(
            criteria,
            SALE_FILTER_FIELDS_MAP,
            SEARCH_FIELDS,
            order,
            saleSchema,
            populateStages,
            {
                saleStatus: SaleStatus.TERMINATED,
                ...buildPeriodCriteria('saleDate', criteria.from, criteria.to)
            }
        );
        const filterUpdates = await initFilterUpdatesUsingMultipleRepository(
            getOrderFilterUpdateConfigs()
        );
        setFilterUpdatesCounts(filterUpdates, sales, SALE_FILTER_FIELDS_MAP, {
            clients: {},
            sellers: {},
            types: {},
            clientTypes: {}
        });
        return {
            filter: filterUpdates as SaleFilterUpdates,
            items: paginate(sales, page),
            totalItems: sales.length
        };
    }

    async getById(id: string): Promise<Sale | null> {
        return saleService.getById(id);
    }
}

export const saleMonitoringService = new SaleMonitoringService();
