import { ServiceRead } from '../common/service/service-read.interface';
import { ServiceWrite } from '../common/service/service-write.interface';
import { Page, Paginated } from '../shared/types/page.interface';
import { Sort } from '../shared/types/sort.type';
import { Payment } from './payment.model';
import { paymentRepository } from './payment.repository';

export interface PaginatedPayment extends Paginated<Payment> {}

class PaymentService implements ServiceRead<Payment>, ServiceWrite<Payment> {
    async getPaginatedList(
        // tslint:disable-next-line:no-any
        criteria: any,
        page: Page,
        order: Sort<Payment> = {}
    ): Promise<PaginatedPayment> {
        const totalItems: number = await paymentRepository.count(criteria);
        const items: Payment[] = await paymentRepository.getPaginated(criteria, page, order).exec();
        return { items, totalItems };
    }

    async getAll(): Promise<Payment[]> {
        return paymentRepository.find({}).exec();
    }

    async getById(id: string): Promise<Payment | null> {
        return paymentRepository.findById(id).exec();
    }

    async create(item: Payment): Promise<Payment> {
        return paymentRepository.create(item);
    }

    async delete(id: string): Promise<boolean> {
        return paymentRepository.delete(id);
    }

    async update(id: string, item: Payment): Promise<Payment | null> {
        return paymentRepository.update(id, item);
    }
}

export const paymentService = new PaymentService();
