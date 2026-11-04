import { injectable } from 'inversify';
import { IMailProvider } from './IMailProvider';

@injectable()
export class ConsoleMailProvider implements IMailProvider {
  async sendMail(message: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
  }) {
    console.log('========== E-MAIL DE TESTE ==========');
    console.log('De:', message.from);
    console.log('Para:', message.to);
    console.log('Assunto:', message.subject);
    console.log('Mensagem:', message.text);
    console.log('=====================================');

    return {
      previewUrl: 'E-mail exibido no console',
    };
  }
}