import { ICommentDocument, ICommentJob, ICommentNameList, IQueryComment } from '@comment/interfaces/comment.interface';
import { CommentsModel } from '@comment/models/comment.schema';
import { IPostDocument } from '@post/interfaces/post.interface';
import { PostModel } from '@post/models/post.schema';
import { UserCache } from '@service/redis/user.cache';
import { IUserDocument } from '@user/interfaces/user.interface';
import { Query } from 'mongoose';
const userCache:UserCache = new UserCache();
class CommmentService{
  public async addCommentToDB(commentData:ICommentJob):Promise<void>{
    const {postId,userTo,userFrom,comment,username} = commentData;
    const comments:Promise<ICommentDocument> = CommentsModel.create(comment);
    const post:Query<IPostDocument,IPostDocument> = PostModel.findOneAndUpdate({_id:postId},{
      $inc :{commentsCount : 1}
    },{new:true}) as Query<IPostDocument,IPostDocument> ;
    const user : Promise<IUserDocument> = userCache.getUserFromCache(userTo) as Promise<IUserDocument>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response:[ICommentDocument,IPostDocument,IUserDocument] =await Promise.all([comments,post,user]);

  }
  public async getPostComments(query:IQueryComment, sort:Record<string,1|-1>): Promise<ICommentDocument[]>{
   const comments :ICommentDocument[] = await CommentsModel.aggregate([
    {$match : query},
    {$sort : sort}
   ]);
   return comments;
  }
  public async getPostCommentName(query:IQueryComment, sort:Record<string,1|-1>): Promise<ICommentNameList[]>{
    const commentsNameList :ICommentNameList[] = await CommentsModel.aggregate([
     {$match : query},
     {$sort : sort},
     {$group : {
      _id:null,names:{
           $addToSet:'$username'
      },
      count:{
        $sum:1
   }
     }},
     { $project: { _id: 0 } }
    ]);
    return commentsNameList;
   }
}
export const commmentService: CommmentService = new CommmentService();
