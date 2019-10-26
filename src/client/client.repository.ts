import { BaseRepository } from '../common/repository/base.repository';
import { Client } from './client.model';
import { ClientDocument, clientSchema } from './client.schema';

class ClientRepository extends BaseRepository<ClientDocument, Client> {
    constructor() {
        super(clientSchema);
    }
}

export const clientRepository = new ClientRepository();
