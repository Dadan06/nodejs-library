export interface ServiceWrite<T> {
    create(item: T): Promise<T>;
    delete(id: string): Promise<boolean>;
    update(id: string, item: T): Promise<T | null>;
}
