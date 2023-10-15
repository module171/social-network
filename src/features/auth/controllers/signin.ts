import { Request, Response } from 'express';
import { config } from '@root/config';
import HTTP_STATUS from 'http-status-codes';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import JWT from 'jsonwebtoken';
import { loginSchema } from '@auth/schemes/signin';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { IUserDocument } from '@user/interfaces/user.interface';
import { userService } from '@service/db/user.service';
import Logger from 'bunyan';
const log: Logger = config.createLogger('SignIn');
export class SignIn {
    @joiValidation(loginSchema)
    public async read(req: Request, res: Response): Promise<void> {
        const { username, password } = req.body;
        const existingUser: IAuthDocument = await authService.getAuthUserByUsername(username);
        if (!existingUser) {
            throw new BadRequestError('Invalid credentials');
        }
        const passwordsMatch: boolean = await existingUser.comparePassword(password);
        if (!passwordsMatch) {
            throw new BadRequestError('Invalid credentials');
        }

        const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);
        // log.info(user);
        const userJwt = JWT.sign({
            userId: user._id,
            uId: existingUser.uId,
            email: existingUser.email,
            username: existingUser.username,
            avartarColor: existingUser.avatarColor
        },
            config.JWT_TOKEN!
        );
        const userDocument: IUserDocument = {
            ...user,
            authId: existingUser!._id,
            username: existingUser!.username,
            email: existingUser!.email,
            avatarColor: existingUser!.avatarColor,
            uId: existingUser!.uId,
            createdAt: existingUser!.createdAt,
        } as IUserDocument;
        req.session = { jwt: userJwt };
        res.status(HTTP_STATUS.OK).json({ message: 'User login succesfully', user: userDocument, token: userJwt });

    }
}