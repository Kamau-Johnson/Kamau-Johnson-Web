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

    // Validate fields
    if (!name || !email || !subject || !message) {
      return Response.json(
        {
          success: false,
          error: "All fields are required.",
        },
        { status: 400 }
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");

    const data = await resend.emails.send({
      from: "Kamau Johnson <hello@kamaujohnson.dev>",
      to: ["hello@kamaujohnson.dev"],
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          line-height: 1.6;
          max-width: 600px;
          margin: auto;
          padding: 20px;
        ">

          <h2 style="color:#2563eb;">
            📩 New Portfolio Contact
          </h2>

          <hr />

          <p>
            <strong>Name:</strong> ${safeName}
          </p>

          <p>
            <strong>Email:</strong> ${safeEmail}
          </p>

          <p>
            <strong>Subject:</strong> ${safeSubject}
          </p>

          <h3>Message</h3>

          <p>
            ${safeMessage}
          </p>

          <hr />

          <p style="font-size:14px;color:#666;">
            This email was sent automatically from your portfolio contact form.
          </p>

        </div>
      `,
    });

    return Response.json({
      success: true,
      data,
    });

  } catch (error) {
    console.error("Resend error:", error);

    return Response.json(
      {
        success: false,
        error: "Failed to send email.",
      },
      {
        status: 500,
      }
    );
  }
}