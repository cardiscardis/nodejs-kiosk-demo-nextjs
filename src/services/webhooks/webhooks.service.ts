import crypto from 'node:crypto';

class WebhookVerifier {
  public verify(
    signingKey: string,
    webhookBody: string,
    sigHeader: string
  ): boolean {
    const hmac = crypto.createHmac('sha256', signingKey);
    hmac.update(webhookBody);

    const digest = hmac.digest('base64');
    const match = sigHeader === digest;

    return match;
  }
}

export const webhookVerifier = new WebhookVerifier();
