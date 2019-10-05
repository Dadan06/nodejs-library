import { BaseRepository } from '../common/repository/base.repository';
import { Privilege } from './privilege.model';
import { PrivilegeDocument, privilegeSchema } from './privilege.schema';

class PrivilegeRepository extends BaseRepository<PrivilegeDocument, Privilege> {
    constructor() {
        super(privilegeSchema);
    }
}

export const privilegeRepository = new PrivilegeRepository();
