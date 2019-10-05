import { Role } from '../role/role.model';

export interface AuthenticationResponse {
    user: { _id: string; login: string; role: Role };
    token: string;
}
