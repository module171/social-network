import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import Logger from 'bunyan';
import sendGridMail from '@sendgrid/mail';
import { config } from '@root/config';
import { BadRequestError } from '@global/helpers/error-handler';

interface IMailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}
const log: Logger = config.createLogger('mailOptions');
sendGridMail.setApiKey(config.SENDGRID_API_KEY!);
class MailTransport {
    public async sendMail(receiverMail: string, subject: string, body: string): Promise<void> {
        if (config.NODE_ENV == 'test' || config.NODE_ENV == 'development') {
            this.developmentEmailSender(receiverMail, subject, body);
        } else {
            this.productionEmailSender(receiverMail, subject, body);
        }
    }
    private async developmentEmailSender(receiverMail: string, subject: string, body: string): Promise<void> {
        const transporter: Mail = nodemailer.createTransport({
            host: 'smtp.forwardemail.net',
            port: 465,
            secure: true,
            auth: {

                user: config.SENDER_EMAIL!,
                pass: config.SENDER_EMAIL_PASSWORD!,
            }
        });
        const mailOptions: IMailOptions = {
            from: `Chatty App <${config.SENDER_EMAIL!}>`,
            to: receiverMail,
            subject,
            html: body
        };
        try {
            await transporter.sendMail(mailOptions);
            log.info('Development email sent successfully.');
        } catch (error) {
            log.error('Error sending email', error);
            throw new BadRequestError('Error sending email');
        }

    }
    private async productionEmailSender(receiverMail: string, subject: string, body: string): Promise<void> {
        const transporter: Mail = nodemailer.createTransport({
            host: 'smtp.forwardemail.net',
            port: 465,
            secure: true,
            auth: {

                user: config.SENDER_EMAIL!,
                pass: config.SENDER_EMAIL_PASSWORD!,
            }
        });
        const mailOptions: IMailOptions = {
            from: `Chatty App <${config.SENDER_EMAIL!}>`,
            to: receiverMail,
            subject,
            html: body
        };
        try {
            await transporter.sendMail(mailOptions);
            log.info('Production email sent successfully.');
        } catch (error) {
            log.error('Error sending email', error);
            throw new BadRequestError('Error sending email');
        }

    }
}
export const mailTransport: MailTransport = new MailTransport();