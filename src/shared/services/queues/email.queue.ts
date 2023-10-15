import { BaseQueue } from '@service/queues/base.queue';

class EmailQueue extends BaseQueue {
    constructor() {
        super('user');

    }
}
export const emailQueue: EmailQueue = new EmailQueue();