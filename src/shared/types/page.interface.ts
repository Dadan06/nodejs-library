export interface Page {
    page: number;
    pageSize: number;
}

export interface Paginated<T> {
    items: T[];
    totalItems: number;
}
