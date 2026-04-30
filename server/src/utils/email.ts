import { Resend } from "resend";

type EmailData = {
  name: string;
  sender_email: string;
  receiver_emails: string[];
  subject: string;
  html_body: string;
};

export class Email {
  private readonly resend: Resend | null;
  constructor(api_key?: string) {
    if (api_key !== undefined) {
      this.resend = new Resend(api_key);
    } else {
      this.resend = null;
    }
  }

  async send_email(params: EmailData) {
    if (this.resend === null) {
      // It is a fake logic of sending email
      const error = null;
      return { error };
    }

    return await this.resend.emails.send({
      from: `${params.name} <${params.sender_email}>`,
      to: params.receiver_emails,
      subject: params.subject,
      html: params.html_body,
    });
  }
}
