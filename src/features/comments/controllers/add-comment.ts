import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { IReactionDocument, IReactionJob } from '@reaction/interfaces/reaction.interface';
import { ReactionCache } from '@service/redis/reaction.cache';
import { reactionQueue } from '@service/queues/reaction.queue';
import { addCommentSchema } from '@comment/schemes/comment';
const reactionCache: ReactionCache = new ReactionCache();

export class Add{
  @joiValidation(addCommentSchema)
  public async comment(req: Request, res: Response): Promise<void>{
    const {userTo,postId,profilePicture,comment} = req.body;
    const commentObjectId:ObjectId = new ObjectId();

    res.status(HTTP_STATUS.OK).json({ message: 'Reaction added successfully'});

  }
}
