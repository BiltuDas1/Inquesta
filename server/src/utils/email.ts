import { Resend } from "resend";

type EmailData = {
  name: string;
  sender_email: string;
  receiver_emails: string[];
  subject: string;
  html_body: string;
};

export class Email {
  private readonly resend: Resend;

  constructor(api_key: string) {
    this.resend = new Resend(api_key);
  }

  async send_email(params: EmailData) {
    const { data, error } = await this.resend.emails.send({
      from: `${params.name} <${params.sender_email}>`,
      to: params.receiver_emails,
      subject: params.subject,
      html: params.html_body,
    });

    return { data, error };
  }
}
