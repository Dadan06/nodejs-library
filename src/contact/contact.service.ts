import { ServiceRead } from '../common/service/service-read.interface';
import { ServiceWrite } from '../common/service/service-write.interface';
import { Page, Paginated } from '../shared/types/page.interface';
import { Sort } from '../shared/types/sort.type';
import { Contact } from './contact.model';
import { contactRepository } from './contact.repository';

const notImplemented = 'Method not implemented.';

export interface PaginatedContact extends Paginated<Contact> {}

class ContactService implements ServiceRead<Contact>, ServiceWrite<Contact> {
    async getPaginatedList(
        // tslint:disable-next-line:no-any
        criteria: any,
        page: Page,
        order: Sort<Contact> = {}
    ): Promise<PaginatedContact> {
        const totalItems: number = await contactRepository.count(criteria);
        const items: Contact[] = await contactRepository.getPaginated(criteria, page, order).exec();
        return { items, totalItems };
    }

    async getById(id: string): Promise<Contact | null> {
        return contactRepository.findById(id).exec();
    }

    async create(item: Contact): Promise<Contact> {
        return contactRepository.create(item);
    }

    async delete(id: string): Promise<boolean> {
        return contactRepository.delete(id);
    }

    async update(id: string, item: Contact): Promise<Contact | null> {
        return contactRepository.update(id, item);
    }
}

export const contactService = new ContactService();
