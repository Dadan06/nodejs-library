import * as faker from 'faker';
import { mongoDbObjectId, writeToJson } from '../shared/utils/faker.utils';
import { Supplier } from './supplier.model';

const NB_SUPPLIER = 10;

const suppliers: Supplier[] = Array.from(
    new Array(NB_SUPPLIER),
    (): Supplier => ({
        _id: { $oid: mongoDbObjectId() },
        name: faker.company.companyName(),
        address: faker.address.city(),
        contact: faker.phone.phoneNumber()
    })
);

writeToJson<Supplier>('suppliers.json', suppliers);
