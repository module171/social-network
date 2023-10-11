import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { signupSchema } from '@auth/schemes/signup';
import { IAuthDocument, ISignUpData } from '@auth/interfaces/auth.interface';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { Helpers } from '@global/helpers/helpers';

export class SignUp {
    @joiValidation(signupSchema)
    public async create(req: Request, res: Response): Promise<void> {
        const { username, email, password, avataColor, avataImage } = req.body;
        const checkIfUserExist: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);
        if (checkIfUserExist) {
            throw new BadRequestError('Invalid credentials');
        }
        const authObjectId: ObjectId = new ObjectId();
        const userObjectId: ObjectId = new ObjectId();
        const uId: ObjectId = `${Helpers.generateRandomIntegers(12)}`;

    }
    private aignupData(data: ISignUpData): IAuthDocument {
        const { _id, username, email, password, avataColor } = data;
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