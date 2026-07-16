import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { name, email, subject, message } = await req.json();

    // 1. Basic validation
    if (!name || !email || !subject || !message) {
      return Response.json(
        {
          success: false,
          error: "All fields are required.",
        },
        { status: 400 }
      );
    }

    // 2. Escape client inputs for security
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    // 3. Compile Admin Notification HTML (Template 2)
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

    // 4. Compile Visitor Auto-Reply HTML (Template 1)
    const autoReplyHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="width=device-width" name="viewport" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta content="IE=edge" http-equiv="X-UA-Compatible" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection" />
    <title>I've received your message - Kamau Johnson</title>
    <style>
      @media (prefers-color-scheme: dark){li::marker{color:#c4c4c4}}
    </style>
  </head>
  <body dir="ltr" lang="en" style="background-color:#f8fafc;margin:0;padding:0">
    <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">
      <tbody>
        <tr>
          <td dir="ltr" lang="en" style="margin:0;padding:0;background-color:#f8fafc">
            <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:720px;align:left;width:100%;color:#000000;background-color:#ffffff;border-radius:0px;border-color:#000000">
              <tbody>
                <tr style="width:100%">
                  <td style="padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px">
                    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:0;margin-right:auto;margin-bottom:0;margin-left:auto;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0">
                      <tbody>
                        <tr style="margin:0;padding:0">
                          <td data-id="__react-email-column" style="margin:0;padding:0;background-color:#f8fafc;padding-top:48px;padding-right:24px;padding-bottom:48px;padding-left:24px">
                            <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:720px;align:left;width:100%;color:#111827;background-color:#ffffff;border-radius:0px;border-color:#000000">
                              <tbody>
                                <tr style="width:100%">
                                  <td style="padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px">
                                    <a href="https://www.youtube.com/@OfficialKamauJohnson" style="color:#067df7;text-decoration-line:none" target="_blank"><img class="node-image" alt="YouTube video" src="https://cdn.resend.app/10e66c97-398a-4fbe-8fb7-a257236f65f0" style="display:block;outline:none;border:none;text-decoration:none;max-width:100%;height:auto;margin:0;padding:0" width="100%" /></a>
                                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0">
                                      <tbody>
                                        <tr style="margin:0;padding:0">
                                          <td align="center" data-id="__react-email-column" style="margin:0;padding:0">
                                            <table width="720" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;max-width:720px;width:100%;background:#ffffff;border-style:solid;border-width:1px;border-color:#E5E7EB;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(15,23,42,.06)">
                                              <tbody>
                                                <tr style="margin:0;padding:0">
                                                  <td data-id="__react-email-column" style="margin:0;padding:0;height:4px;background:#1D4ED8;font-size:0;line-height:0">
                                                    <ol start="1" style="margin:0;padding:0;padding-left:1.1em;padding-bottom:1em">
                                                      <li style="margin:0;padding:0;margin-left:1em;padding-bottom:0.3em;padding-top:0.3em"></li>
                                                    </ol>
                                                  </td>
                                                </tr>
                                                <tr style="margin:0;padding:0">
                                                  <td data-id="__react-email-column" style="margin:0;padding:52px 56px 40px;border-bottom:1px solid #E5E7EB">
                                                    <p style="margin:0;padding:0;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#1D4ED8">KAMAU JOHNSON</p>
                                                    <h1 style="margin:12px 0 14px;padding:0;font-size:30px;font-weight:700;line-height:1.3;color:#111827">Your Message Has Been Received</h1>
                                                    <p style="margin:0;padding:0;font-size:16px;line-height:30px;color:#6B7280">Thank you for contacting me through my portfolio website.</p>
                                                  </td>
                                                </tr>
                                                <tr style="margin:0;padding:0">
                                                  <td data-id="__react-email-column" style="margin:0;padding:40px 56px 16px">
                                                    <p style="margin:0;padding:0;font-size:16px;line-height:30px;color:#374151">Hello <strong>${safeName}</strong>, <br /><br />Thank you for taking the time to reach out through <strong>kamaujohnson.dev</strong>. Your message has been successfully received and is now awaiting review.</p>
                                                  </td>
                                                </tr>
                                                <tr style="margin:0;padding:0">
                                                  <td data-id="__react-email-column" style="margin:0;padding:24px 56px 40px">
                                                    <h2 style="margin:0 0 18px;padding:0;font-size:18px;font-weight:600;color:#111827">Confirmation</h2>
                                                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;border-style:solid;border-width:1px;border-color:#E5E7EB;border-left:4px solid #1D4ED8;border-radius:8px;background:#FFFFFF">
                                                      <tbody>
                                                        <tr style="margin:0;padding:0">
                                                          <td data-id="__react-email-column" style="margin:0;padding:30px">
                                                            <p style="margin:0;padding:0;font-size:15px;line-height:30px;color:#374151">Your enquiry has been delivered successfully.</p>
                                                            <p style="margin:18px 0 0;padding:0;font-size:15px;line-height:30px;color:#374151">I personally review every message and typically respond within <strong>24–48 hours</strong> whenever a reply is required.</p>
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                                <tr style="margin:0;padding:0">
                                                  <td data-id="__react-email-column" style="margin:0;padding:0 56px 18px">
                                                    <h2 style="margin:0 0 18px;padding:0;font-size:18px;font-weight:600;color:#111827">While You Wait</h2>
                                                    <p style="margin:0;padding:0;font-size:15px;line-height:30px;color:#374151">Feel free to explore my portfolio, projects, open-source work, and technical content.</p>
                                                  </td>
                                                </tr>
                                                <tr style="margin:0;padding:0">
                                                  <td align="center" data-id="__react-email-column" style="margin:0;padding:20px 56px 48px">
                                                    <p style="margin:0 0 24px;padding:0;font-size:15px;color:#6B7280;font-weight:500">Connect with me</p>
                                                    <a href="https://kamaujohnson.dev" style="color:#067df7;text-decoration-line:none" target="_blank"><img alt="Portfolio" src="https://img.icons8.com/color/48/globe--v1.png" style="display:block;outline:none;border:none;text-decoration:none;height:auto" width="34" /></a>
                                                    <a href="https://www.linkedin.com/in/kamau-johnson-4bab25276/" style="color:#067df7;text-decoration-line:none" target="_blank"><img alt="LinkedIn" src="https://img.icons8.com/color/48/linkedin.png" style="display:block;outline:none;border:none;text-decoration:none;height:auto" width="34" /></a>
                                                    <a href="https://github.com/Kamau-Johnson" style="color:#067df7;text-decoration-line:none" target="_blank"><img alt="GitHub" src="https://img.icons8.com/ios-filled/48/111827/github.png" style="display:block;outline:none;border:none;text-decoration:none;height:auto" width="34" /></a>
                                                    <a href="https://medium.com/@Kamau_Johnson" style="color:#067df7;text-decoration-line:none" target="_blank"><img alt="Medium" src="https://img.icons8.com/ios-filled/48/111827/medium-monogram.png" style="display:block;outline:none;border:none;text-decoration:none;height:auto" width="34" /></a>
                                                    <a href="https://wa.me/254768280952" style="color:#067df7;text-decoration-line:none" target="_blank"><img alt="WhatsApp" src="https://img.icons8.com/color/48/whatsapp.png" style="display:block;outline:none;border:none;text-decoration:none;height:auto" width="34" /></a>
                                                  </td>
                                                </tr>
                                                <tr style="margin:0;padding:0">
                                                  <td data-id="__react-email-column" style="margin:0;padding:32px 56px;border-top:1px solid #E5E7EB;background:#FAFAFA">
                                                    <p style="margin:0;padding:0;font-size:14px;line-height:28px;color:#6B7280">This is an automated confirmation email sent after receiving your message through <strong>kamaujohnson.dev</strong>.</p>
                                                    <p style="margin:14px 0 0;padding:0;font-size:14px;line-height:28px;color:#6B7280">Please do not reply to this email unless instructed. If your enquiry requires a response, I'll contact you using the email address you provided.</p>
                                                    <p style="margin:28px 0 0;padding:0;font-size:13px;color:#9CA3AF">© 2026 Kamau Johnson. All rights reserved.</p>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;

    // 5. Run both requests concurrently
    const [adminRes, autoReplyRes] = await Promise.all([
      resend.emails.send({
        from: "Kamau Johnson <hello@kamaujohnson.dev>",
        to: ["hello@kamaujohnson.dev"],
        replyTo: email,
        subject: `New Portfolio Enquiry: ${safeSubject}`,
        html: adminHtml,
      }),
      resend.emails.send({
        from: "Kamau Johnson <hello@kamaujohnson.dev>",
        to: [email],
        subject: "I've received your message - Kamau Johnson",
        html: autoReplyHtml,
      }),
    ]);

    // 6. Handle errors gracefully
    if (adminRes.error) {
      console.error("Admin notification failed completely:", adminRes.error);
      return Response.json(
        { success: false, error: adminRes.error.message },
        { status: 500 }
      );
    }

    if (autoReplyRes.error) {
      // Log the warning but don't fail the form because the admin received the notification
      console.warn(
        "Auto-reply warning (Visitor email skipped):",
        autoReplyRes.error.message
      );
    }

    return Response.json({
      success: true,
      data: {
        adminNotification: adminRes.data,
        autoReply: autoReplyRes.data,
      },
    });
  } catch (error) {
    console.error("Unhanded server exception during dispatch:", error);
    return Response.json(
      { success: false, error: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}