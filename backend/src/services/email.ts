import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'test');

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@cancerprogressionatlas.org';
const APP_URL = process.env.APP_URL || 'https://yerry262.github.io/CancerProgressionAtlas';

export const emailService = {
  /**
   * Send email verification link to user
   */
  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    try {
      const verifyUrl = `${APP_URL}/verify-email?token=${encodeURIComponent(token)}`;

      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Verify your CancerProgressionAtlas account',
        html: `
          <p>Thanks for signing up! Click the link below to verify your email address:</p>
          <p><a href="${verifyUrl}">Verify Email</a></p>
          <p>This link expires in 24 hours.</p>
          <hr>
          <p><small>If you didn't create this account, you can safely ignore this email.</small></p>
        `,
      });
      return true;
    } catch (err) {
      console.error('Failed to send verification email:', err);
      return false;
    }
  },

  /**
   * Notify user their submission was approved
   */
  async sendSubmissionApprovedEmail(email: string, cancerType: string): Promise<boolean> {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Your submission has been approved!',
        html: `
          <p>Great news! Your medical imaging submission for <strong>${cancerType}</strong> has been approved and added to the CancerProgressionAtlas dataset.</p>
          <p>Your data will help train AI models to detect cancer earlier and save lives.</p>
          <p><a href="${APP_URL}/submissions">View My Submissions</a></p>
          <hr>
          <p><small>Thank you for contributing to this important research.</small></p>
        `,
      });
      return true;
    } catch (err) {
      console.error('Failed to send approval email:', err);
      return false;
    }
  },

  /**
   * Notify user their submission was rejected
   */
  async sendSubmissionRejectedEmail(email: string, reason: string): Promise<boolean> {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: 'Submission review update',
        html: `
          <p>Thank you for your submission to CancerProgressionAtlas. After review, we weren't able to add it to the dataset.</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p>You're welcome to submit additional scans. Visit <a href="${APP_URL}/upload">Upload</a> to try again.</p>
          <hr>
          <p><small>If you have questions, please contact us at support@cancerprogressionatlas.org</small></p>
        `,
      });
      return true;
    } catch (err) {
      console.error('Failed to send rejection email:', err);
      return false;
    }
  },

  /**
   * Send admin notification of new submission
   */
  async sendAdminNewSubmissionEmail(adminEmail: string, count: number): Promise<boolean> {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: adminEmail,
        subject: `New submissions pending review (${count} total)`,
        html: `
          <p>You have <strong>${count}</strong> submissions waiting for review.</p>
          <p><a href="${APP_URL}/admin">Review Queue</a></p>
        `,
      });
      return true;
    } catch (err) {
      console.error('Failed to send admin email:', err);
      return false;
    }
  },
};
