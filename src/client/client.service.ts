import { ServiceRead } from '../common/service/service-read.interface';
import { ServiceWrite } from '../common/service/service-write.interface';
import { FilterFieldMap } from '../product/product.service';
import { Page, Paginated } from '../shared/types/page.interface';
import { getFilteredWithEmbeddedFields } from '../shared/utils/filter-paginate.utils';
import { Client } from './client.model';
import { clientRepository } from './client.repository';
import { clientSchema } from './client.schema';

export interface PaginatedClient extends Paginated<Client> {}

const FILTER_FIELDS_MAP: FilterFieldMap = {};
const SEARCH_FIELDS: Array<string> = ['name', 'address'];

class ClientService implements ServiceRead<Client>, ServiceWrite<Client> {
    async getPaginatedList(
        // tslint:disable-next-line:no-any
        criteria: any,
        page: Page,
        // tslint:disable-next-line: no-any
        order: any
    ): Promise<PaginatedClient> {
        const totalItems: number = await clientRepository.count(criteria);
        const items: Client[] = await getFilteredWithEmbeddedFields(
            criteria,
            FILTER_FIELDS_MAP,
            SEARCH_FIELDS,
            order,
            clientSchema,
            [],
            {}
        );
        return { items, totalItems };
    }

    async getAll(): Promise<Client[]> {
        return clientRepository.find({}).exec();
    }

    async getById(id: string): Promise<Client | null> {
        return clientRepository.findById(id).exec();
    }

    async create(item: Client): Promise<Client> {
        return clientRepository.create(item);
    }

    async delete(id: string): Promise<boolean> {
        return clientRepository.delete(id);
    }

    async update(id: string, item: Client): Promise<Client | null> {
        return clientRepository.update(id, item);
    }
}

export const clientService = new ClientService();
