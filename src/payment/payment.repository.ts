import { BaseRepository } from '../common/repository/base.repository';
import { Payment } from './payment.model';
import { PaymentDocument, paymentSchema } from './payment.schema';

class PaymentRepository extends BaseRepository<PaymentDocument, Payment> {
    constructor() {
        super(paymentSchema);
    }
}

export const paymentRepository = new PaymentRepository();
