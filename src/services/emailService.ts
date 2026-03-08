import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendBookingConfirmation = async (data: {
  toEmail: string;
  toName: string;
  trekName: string;
  trekLocation: string;
  date: string;
  people: number;
  totalPrice: number;
}) => {
  const formattedDate = new Date(data.date).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

        <!-- Header -->
        <div style="background:linear-gradient(135deg,#16a34a,#15803d);border-radius:20px 20px 0 0;padding:40px;text-align:center;">
          <div style="font-size:32px;font-weight:900;color:white;letter-spacing:-0.02em;margin-bottom:4px;">
            Trekly
          </div>
          <p style="color:rgba(255,255,255,0.8);font-size:14px;margin:0;">Your adventure awaits</p>
        </div>

        <!-- Body -->
        <div style="background:white;padding:40px;border-left:1px solid #f1f5f9;border-right:1px solid #f1f5f9;">

          <!-- Success icon -->
          <div style="text-align:center;margin-bottom:28px;">
            <div style="width:64px;height:64px;background:#f0fdf4;border-radius:50%;border:2px solid #16a34a;display:inline-flex;align-items:center;justify-content:center;font-size:28px;">
              ✓
            </div>
          </div>

          <h1 style="font-size:24px;font-weight:800;color:#0f172a;text-align:center;margin-bottom:8px;letter-spacing:-0.02em;">
            Booking Confirmed!
          </h1>
          <p style="color:#64748b;text-align:center;font-size:15px;line-height:1.6;margin-bottom:32px;">
            Hi <strong style="color:#0f172a;">${data.toName}</strong>, your trek has been successfully booked.
            We're excited to have you!
          </p>

          <!-- Booking details card -->
          <div style="background:#f8fafc;border-radius:16px;padding:24px;border:1px solid #f1f5f9;margin-bottom:28px;">
            <p style="font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:0.08em;margin-bottom:16px;">BOOKING DETAILS</p>

            ${[
              { label: "Trek", value: data.trekName },
              { label: "Location", value: data.trekLocation },
              { label: "Start Date", value: formattedDate },
              { label: "Group Size", value: `${data.people} ${data.people === 1 ? "person" : "people"}` },
              { label: "Total Amount", value: `Rs. ${data.totalPrice.toLocaleString()}`, highlight: true },
            ].map(row => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #f1f5f9;">
                <span style="font-size:13px;color:#94a3b8;font-weight:500;">${row.label}</span>
                <span style="font-size:13px;font-weight:700;color:${row.highlight ? "#16a34a" : "#0f172a"};">${row.value}</span>
              </div>
            `).join("")}
          </div>

          <!-- What's next -->
          <div style="background:#f0fdf4;border-radius:16px;padding:24px;border:1px solid #bbf7d0;margin-bottom:28px;">
            <p style="font-size:13px;font-weight:700;color:#166534;margin-bottom:12px;">What happens next?</p>
            ${[
              "Our team will contact you within 24 hours to confirm your booking.",
              "You will receive a detailed packing list and preparation guide.",
              "Full payment is due 7 days before your trek start date.",
            ].map((item, i) => `
              <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;">
                <div style="width:20px;height:20px;background:#16a34a;border-radius:50%;color:white;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">${i + 1}</div>
                <p style="font-size:13px;color:#166534;line-height:1.5;margin:0;">${item}</p>
              </div>
            `).join("")}
          </div>

          <p style="font-size:13px;color:#94a3b8;text-align:center;line-height:1.6;">
            Questions? Reply to this email or contact us at<br>
            <a href="mailto:contact@trekly.com" style="color:#16a34a;font-weight:700;text-decoration:none;">contact@trekly.com</a>
          </p>
        </div>

        <!-- Footer -->
        <div style="background:#f8fafc;border-radius:0 0 20px 20px;padding:24px;text-align:center;border:1px solid #f1f5f9;border-top:none;">
          <p style="font-size:12px;color:#94a3b8;margin:0;">
            © 2026 Trekly. This email was sent to ${data.toEmail}
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: data.toEmail,
    subject: `Booking Confirmed — ${data.trekName}`,
    html,
  });
};