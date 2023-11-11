import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';
import { config } from '@root/config';
import { reactionService } from '@service/db/reaction.service';
const log: Logger = config.createLogger('reactWorker');

class RectionWorker {
  async addRectionToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { data } = job.data;
      await reactionService.addReactionDataToDB(data);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
  async removeRectionToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { data } = job.data;
      await reactionService.removeReactionDataFromDB(data);
      job.progress(100);
      done(null, job.data);
    } catch (error) {
      log.error(error);
      done(error as Error);
    }
  }
}
export const reactWorker: RectionWorker = new RectionWorker();
