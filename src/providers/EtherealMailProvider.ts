import { injectable } from 'inversify';
import nodemailer from 'nodemailer';
import { getMailClient } from '../lib/mail';
import { IMailProvider } from './IMailProvider';

@injectable()
export class EtherealMailProvider implements IMailProvider {
  async sendMail(message: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
  }) {
    const mailer = await getMailClient();

    const info = await mailer.sendMail(message);

    return {
      info,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  }
}
