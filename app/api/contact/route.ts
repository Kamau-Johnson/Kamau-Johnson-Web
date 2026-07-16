import { Resend } from "resend";

export const runtime = "nodejs";

const escapeHtml = (str: string) =>
  str.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char]!
  );

export async function POST(req: Request) {
  try {
    // 1. Safe configuration check
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return Response.json(
        { success: false, error: "Missing RESEND_API_KEY environment variable. Please configure it in Vercel." },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const { name, email, subject, message } = await req.json();

    // 2. Basic validation
    if (!name || !email || !subject || !message) {
      return Response.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    // 3. Escape client inputs for security
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    // 4. Compile Admin Notification HTML (Template 2)
    const adminHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Contact Form Submission</title>
  </head>
  <body style="margin:0;padding:48px 24px;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center">
          <table role="presentation" width="720" cellpadding="0" cellspacing="0" border="0" style="max-width:720px;width:100%;background:#ffffff;border:1px solid #E5E7EB;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(15,23,42,.06);">
            <tr>
              <td style="height:4px;background:#1D4ED8;font-size:0;line-height:0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding:52px 56px 40px;border-bottom:1px solid #E5E7EB;">
                <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#1D4ED8;">KAMAU JOHNSON</p>
                <h1 style="margin:12px 0 14px;font-size:30px;font-weight:700;line-height:1.3;color:#111827;">Contact Submission</h1>
                <p style="margin:0;font-size:16px;line-height:30px;color:#6B7280;">A new enquiry has been received through your portfolio website.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:40px 56px 16px;">
                <p style="margin:0;font-size:16px;line-height:30px;color:#374151;">
                  A visitor has submitted a message through the contact form on <strong>kamaujohnson.dev</strong>.
                  <br /><br />
                  The sender's details and message are provided below. If a response is required, you can reply directly using the button at the bottom of this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 56px 40px;">
                <h2 style="margin:0 0 18px;font-size:18px;font-weight:600;color:#111827;">Sender Information</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E5E7EB;border-radius:8px;overflow:hidden;">
                  <tr>
                    <td width="170" style="padding:18px 22px;background:#F9FAFB;border-bottom:1px solid #E5E7EB;font-size:13px;font-weight:600;color:#4B5563;">Name</td>
                    <td style="padding:18px 22px;border-bottom:1px solid #E5E7EB;font-size:15px;color:#111827;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="padding:18px 22px;background:#F9FAFB;border-bottom:1px solid #E5E7EB;font-size:13px;font-weight:600;color:#4B5563;">Email</td>
                    <td style="padding:18px 22px;border-bottom:1px solid #E5E7EB;font-size:15px;"><a href="mailto:${safeEmail}" style="color:#1D4ED8;text-decoration:none;">${safeEmail}</a></td>
                  </tr>
                  <tr>
                    <td style="padding:18px 22px;background:#F9FAFB;font-size:13px;font-weight:600;color:#4B5563;">Subject</td>
                    <td style="padding:18px 22px;font-size:15px;color:#111827;">${safeSubject}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 56px 44px;">
                <h2 style="margin:0 0 18px;font-size:18px;font-weight:600;color:#111827;">Message</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #E5E7EB;border-left:4px solid #1D4ED8;border-radius:8px;background:#FFFFFF;">
                  <tr>
                    <td style="padding:30px;font-size:15px;line-height:30px;color:#374151;white-space:pre-wrap;">${safeMessage}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 56px 52px;">
                <a href="mailto:${safeEmail}" style="display:inline-block;background:#1D4ED8;color:#ffffff;text-decoration:none;padding:16px 34px;border-radius:6px;font-size:15px;font-weight:600;">Reply via Email</a>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 56px;border-top:1px solid #E5E7EB;background:#FAFAFA;">
                <p style="margin:0;font-size:14px;line-height:28px;color:#6B7280;">This is an automated notification of a new contact submission on <strong>kamaujohnson.dev</strong>.</p>
                <p style="margin:14px 0 0;font-size:14px;line-height:28px;color:#6B7280;">To respond, use the <strong>Reply via Email</strong> button above or reply directly to the sender's email address.</p>
                <p style="margin:28px 0 0;font-size:13px;color:#9CA3AF;">© 2026 Kamau Johnson. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    // 5. Compile Visitor Auto-Reply HTML (Upgraded & Polished Template)
    const autoReplyHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>I've received your message - Kamau Johnson</title>
    <style type="text/css">
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      img { -ms-interpolation-mode: bicubic; }
      img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
      table { border-collapse: collapse !important; }
      body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f8fafc; }
      @media (prefers-color-scheme: dark){li::marker{color:#c4c4c4}}
    </style>
  </head>
  <body style="background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 48px 24px;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 640px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05); border-collapse: separate;">
            <tr>
              <td style="height: 4px; background-color: #1d4ed8; font-size: 0; line-height: 0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="padding: 0; font-size: 0; line-height: 0;">
                <a href="https://www.youtube.com/@OfficialKamauJohnson" target="_blank" style="text-decoration: none;">
                  <img src="https://cdn.resend.app/10e66c97-398a-4fbe-8fb7-a257236f65f0" alt="YouTube Video Presentation" width="640" style="width: 100%; max-width: 100%; display: block; border: 0;" />
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 40px 48px 24px; border-bottom: 1px solid #f1f5f9;">
                <p style="margin: 0; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #1d4ed8;">KAMAU JOHNSON</p>
                <h1 style="margin: 12px 0 8px; font-size: 28px; font-weight: 800; line-height: 1.25; color: #0f172a; letter-spacing: -0.02em;">Your Message Has Been Received</h1>
                <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #64748b;">Thank you for getting in touch through my portfolio website.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 48px 24px;">
                <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #334155;">
                  Hello <strong>${safeName}</strong>,
                </p>
                <p style="margin: 12px 0 0; font-size: 15px; line-height: 1.6; color: #334155;">
                  Thank you for taking the time to reach out. Your message has been successfully received and is currently in my inbox awaiting review.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 48px 24px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border-left: 4px solid #1d4ed8; border-radius: 6px; border-collapse: separate;">
                  <tr>
                    <td style="padding: 24px; border: 1px solid #e2e8f0; border-left: 0; border-top-right-radius: 6px; border-bottom-right-radius: 6px;">
                      <h3 style="margin: 0 0 6px; font-size: 13px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em;">Status: Delivered</h3>
                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #475569;">
                        I review every incoming message and typically respond within <strong>24–48 hours</strong> whenever a follow-up is required.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 48px 40px; border-bottom: 1px solid #f1f5f9;">
                <h2 style="margin: 0 0 8px; font-size: 16px; font-weight: 700; color: #0f172a;">While You Wait</h2>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #475569;">
                  Feel free to explore my portfolio, review my active open-source projects, or read my technical publications.
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 32px 48px 36px; background-color: #fafafa;">
                <p style="margin: 0 0 16px; font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em;">Connect with me</p>
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 0 8px;">
                      <a href="https://kamaujohnson.dev" target="_blank" style="text-decoration: none;">
                        <img src="https://img.icons8.com/color/48/globe--v1.png" width="34" height="34" alt="Portfolio" style="display: block;" />
                      </a>
                    </td>
                    <td style="padding: 0 8px;">
                      <a href="https://www.linkedin.com/in/kamau-johnson-4bab25276/" target="_blank" style="text-decoration: none;">
                        <img src="https://img.icons8.com/color/48/linkedin.png" width="34" height="34" alt="LinkedIn" style="display: block;" />
                      </a>
                    </td>
                    <td style="padding: 0 8px;">
                      <a href="https://github.com/Kamau-Johnson" target="_blank" style="text-decoration: none;">
                        <img src="https://img.icons8.com/ios-filled/48/111827/github.png" width="34" height="34" alt="GitHub" style="display: block;" />
                      </a>
                    </td>
                    <td style="padding: 0 8px;">
                      <a href="https://medium.com/@Kamau_Johnson" target="_blank" style="text-decoration: none;">
                        <img src="https://img.icons8.com/ios-filled/48/111827/medium-monogram.png" width="34" height="34" alt="Medium" style="display: block;" />
                      </a>
                    </td>
                    <td style="padding: 0 8px;">
                      <a href="https://wa.me/254768280952" target="_blank" style="text-decoration: none;">
                        <img src="https://img.icons8.com/color/48/whatsapp.png" width="34" height="34" alt="WhatsApp" style="display: block;" />
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 28px 48px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: left;">
                <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #64748b;">
                  This is an automated confirmation email sent from <strong>kamaujohnson.dev</strong>.
                </p>
                <p style="margin: 8px 0 0; font-size: 13px; line-height: 1.5; color: #64748b;">
                  Please do not reply directly to this automated email. If a follow-up is needed, I will reach out using the email address you provided.
                </p>
                <p style="margin: 20px 0 0; font-size: 12px; color: #94a3b8; font-weight: 500;">
                  © 2026 Kamau Johnson. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    // 6. Run requests concurrently
    const [adminRes, autoReplyRes] = await Promise.all([
      resend.emails.send({
        from: "Kamau Johnson <hello@kamaujohnson.dev>",
        to: ["johnsonkamau542@gmail.com"], // <-- FIXED: Sends the admin notification directly to your active inbox
        replyTo: email,
        subject: `New Portfolio Enquiry: ${safeSubject}`,
        html: adminHtml,
      }),
      resend.emails.send({
        from: "Kamau Johnson <hello@kamaujohnson.dev>",
        to: [email], // <-- Sends the auto-reply to the guest's input email address
        subject: "I've received your message - Kamau Johnson",
        html: autoReplyHtml,
      }),
    ]);

    // 7. Check if admin notification failed completely
    if (adminRes.error) {
      console.error("Admin notification failed:", adminRes.error);
      return Response.json(
        { success: false, error: `Admin notification failed: ${adminRes.error.message}` },
        { status: 500 }
      );
    }

    if (autoReplyRes.error) {
      console.warn("Auto-reply skipped/failed:", autoReplyRes.error.message);
    }

    return Response.json({
      success: true,
      data: {
        adminNotification: adminRes.data,
        autoReply: autoReplyRes.data,
      },
    });
  } catch (error: any) {
    console.error("Unhanded server exception during dispatch:", error);
    return Response.json(
      { success: false, error: error.message || "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}