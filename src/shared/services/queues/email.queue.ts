import { BaseQueue } from "@service/queunes/base.queue";

class EmailQueue extends BaseQueue {
    constructor() {
        super('user');

    }
}
export const emailQueue: EmailQueue = new EmailQueue();