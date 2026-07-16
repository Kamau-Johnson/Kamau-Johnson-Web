import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    const data = await resend.emails.send({
      from: "Kamau Johnson <hello@kamaujohnson.dev>",
      to: ["hello@kamaujohnson.dev"],
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto;">
          <h2 style="color:#2563eb;">📩 New Portfolio Contact</h2>

          <hr>

          <p><strong>Name:</strong> ${name}</p>

          <p><strong>Email:</strong> ${email}</p>

          <p><strong>Subject:</strong> ${subject}</p>

          <h3>Message</h3>

          <p>${message.replace(/\n/g, "<br>")}</p>

          <hr>

          <p style="font-size:14px;color:#666;">
            This email was sent automatically from your portfolio contact form.
          </p>
        </div>
      `,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error: "Failed to send email.",
      },
      { status: 500 }
    );
  }
}