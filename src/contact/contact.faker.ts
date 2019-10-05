import * as faker from 'faker';
import { mongoDbObjectId, writeToJson } from '../shared/utils/faker.utils';
import { Contact } from './contact.model';

const NB_CONTACT = 30;

const contacts: Contact[] = Array.from(
    new Array(NB_CONTACT),
    (): Contact => ({
        _id: { $oid: mongoDbObjectId() },
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        address: faker.address.streetAddress(),
        phone: faker.phone.phoneNumber(),
        email: faker.internet.email()
    })
);

writeToJson<Contact>('contacts.json', contacts);
