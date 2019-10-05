import { BaseRepository } from '../common/repository/base.repository';
import { Role } from './role.model';
import { RoleDocument, roleSchema } from './role.schema';

class RoleRepository extends BaseRepository<RoleDocument, Role> {
    constructor() {
        super(roleSchema);
    }
}

export const roleRepository = new RoleRepository();
