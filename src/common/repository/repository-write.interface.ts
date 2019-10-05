export interface RepositoryWrite<T, U> {
    create(item: U): Promise<T>;
    delete(id: string): Promise<boolean>;
    update(id: string, item: U): Promise<T | null>;
}
