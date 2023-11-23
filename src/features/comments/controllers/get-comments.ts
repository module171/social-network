
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import { ICommentDocument, ICommentNameList } from '@comment/interfaces/comment.interface';
import { CommentCache } from '@service/redis/comment.cache';
import { commmentService } from '@service/db/comment.service';
import mongoose from 'mongoose';
const commentCache: CommentCache = new CommentCache();

export class Get {

  public async comments(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const cachedComments: ICommentDocument[] = await commentCache.getCommentsFromCache(postId);
    const comments: ICommentDocument[] = cachedComments.length
      ? cachedComments
      : await commmentService.getPostComments({ postId: new mongoose.Types.ObjectId(postId) }, { createAt: -1 });
    res.status(HTTP_STATUS.OK).json({ message: 'Post comment' ,comments});
  }

  public async commentsNamesFromCache(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const cachedCommentsNames: ICommentNameList[] = await commentCache.getCommentsNameFromCache(postId);
    const commentsNames: ICommentNameList[] = cachedCommentsNames.length
      ? cachedCommentsNames
      : await commmentService.getPostCommentName({ postId: new mongoose.Types.ObjectId(postId) }, { createAt: -1 });
    res.status(HTTP_STATUS.OK).json({ message: 'Post comment names' ,comments :commentsNames});
  }

  public async singleComment(req: Request, res: Response): Promise<void> {
    const { postId,commentId } = req.params;
    const cachedComments: ICommentDocument[] = await commentCache.getSingleCommentFromCache(postId,commentId);
    const comments: ICommentDocument[] = cachedComments.length
      ? cachedComments
      : await commmentService.getPostComments({ _id: new mongoose.Types.ObjectId(commentId) }, { createAt: -1 });
    res.status(HTTP_STATUS.OK).json({ message: 'Single comment' ,comments :comments[0]});
  }

}
