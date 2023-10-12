import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { signupSchema } from '@auth/schemes/signup';
import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';
import { uploads } from '@global/helpers/cloudinary-upload';
import HTTP_STATUS from 'http-status-codes';
import cloudinary, { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
export class SignUp {
    @joiValidation(signupSchema)
    public async create(req: Request, res: Response): Promise<void> {
        const { username, email, password, avatarColor, avatarImage } = req.body;
        const checkIfUserExist: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);
        if (checkIfUserExist) {
            throw new BadRequestError('Invalid credentials');
        }
        const authObjectId: ObjectId = new ObjectId();
        const userObjectId: ObjectId = new ObjectId();
        const uId = `${Helpers.generateRandomIntegers(12)}`;
        const authData: IAuthDocument = SignUp.prototype.signupData({
            _id: authObjectId,
            uId,
            username,
            email,
            password,
            avatarColor
        });
        const result: UploadApiResponse = (await uploads(avatarImage, `${userObjectId}`, true, true)) as UploadApiResponse;
        if (!result?.public_id) {
            throw new BadRequestError('File upload :Error occurred. Try again.');
        }
        // try {
        //     // Gọi hàm uploads để tải lên tệp
        //     const result: UploadApiResponse = (await uploads(avatarImage, `${userObjectId}`, true, true)) as UploadApiResponse;

        //     // Xử lý kết quả nếu tải lên thành công
        //     console.log('Tải lên thành công:', result);
        // } catch (error) {
        //     // Xử lý lỗi nếu có lỗi xảy ra
        //     console.error('Lỗi khi tải lên:', error);
        // }
        res.status(HTTP_STATUS.CREATED).json({ message: 'User created succesfully', authData });
    }
    private signupData(data: ISignUpData): IAuthDocument {
        const { _id, username, email, uId, password, avatarColor } = data;
        return {
            _id,
            uId,
            username: Helpers.firstLetterUpperCase(username),
            email: Helpers.lowCase(email),
            password,
            avatarColor, createdAt: new Date()
        } as IAuthDocument;
    }
}