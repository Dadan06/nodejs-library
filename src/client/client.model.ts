export enum ClientType {
    PARTICULAR = 'PARTICULAR',
    GROUP = 'GROUP'
}

export interface Client {
    // tslint:disable-next-line: no-any
    _id: any;
    name: string;
    address: string;
    contact: string;
    email: string;
    remark: string | null;
    type: ClientType;
}
