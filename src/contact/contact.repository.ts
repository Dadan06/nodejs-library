import { BaseRepository } from '../common/repository/base.repository';
import { Contact } from './contact.model';
import { ContactDocument, contactSchema } from './contact.schema';

class ContactRepository extends BaseRepository<ContactDocument, Contact> {
    constructor() {
        super(contactSchema);
    }
}

export const contactRepository = new ContactRepository();
