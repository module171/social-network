import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { addReactionSchema } from '@reaction/schemes/reactions';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { IReactionDocument, IReactionJob } from '@reaction/interfaces/reaction.interface';
import { ReactionCache } from '@service/redis/reaction.cache';
import { reactionQueue } from '@service/queues/reaction.queue';
const reactionCache: ReactionCache = new ReactionCache();

export class Remove{

  public async reaction(req: Request, res: Response): Promise<void>{
    const {postId,previousReaction,postReactions} = req.body;

    await reactionCache.removePostReactionFromCache(postId,`${req.currentUser!.username}`,);
    const databaseReactionData: IReactionJob = {
      postId,
      userTo,
      userFrom: req.currentUser!.userId,
      username: req.currentUser!.username,
      type,
      previousReaction,
      reactionObject
    };
    reactionQueue.addReactionJob('addReactionToDB', databaseReactionData);
    res.status(HTTP_STATUS.OK).json({ message: 'Reaction added successfully'});

  }
}
