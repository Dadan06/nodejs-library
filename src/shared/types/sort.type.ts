export type Sort<T> = {
    // tslint:disable-next-line:max-union-size
    [key in keyof T]?: 'asc' | 'desc' | 1 | -1
};
