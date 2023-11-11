
import { IReactionJob } from '@reaction/interfaces/reaction.interface';
import { BaseQueue } from '@service/queues/base.queue';
import { reactWorker } from '@worker/reaction.worker';

class ReactionQueue extends BaseQueue {
  constructor() {
    super('reactions');
    this.processJob('addRectionToDB', 5, reactWorker.addRectionToDB);
    this.processJob('removeRectionToDB', 5, reactWorker.removeRectionToDB);
  }
  public addReactionJob(name: string, data: IReactionJob): void {
    this.addJob(name, data);
  }
}
export const reactionQueue: ReactionQueue = new ReactionQueue();
