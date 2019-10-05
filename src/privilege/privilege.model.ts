export enum UserPrivileges {
    ADD_CONTACT = '[Contact] Add Contact',
    EDIT_CONTACT = '[Contact] Edit Contact',
    DELETE_CONTACT = '[Contact] Delete Contact',
    VIEW_CONTACTS = '[Contact] View Contacts'
}

export enum PrivilegeCategories {
    CONTACT = '[Category] Contact'
}

export interface Privilege {
    // tslint:disable-next-line: no-any
    _id: any;
    name: UserPrivileges;
    category: PrivilegeCategories;
}
