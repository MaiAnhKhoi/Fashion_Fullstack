import { env } from "@/config/env.config";

type OtpPurpose = "register" | "reset_password";

interface OtpEmailParams {
  otp: string;
  purpose: OtpPurpose;
  fullName?: string | null;
  expiresMinutes: number;
}

const COPY: Record<OtpPurpose, { subject: string; heading: string; intro: string }> = {
  register: {
    subject: "Xác nhận đăng ký tài khoản",
    heading: "Xác minh email của bạn",
    intro: "Cảm ơn bạn đã đăng ký. Hãy dùng mã OTP bên dưới để hoàn tất xác minh email.",
  },
  reset_password: {
    subject: "Mã đặt lại mật khẩu",
    heading: "Đặt lại mật khẩu",
    intro: "Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Dùng mã OTP bên dưới để tiếp tục.",
  },
};

/** Trả về { subject, html } cho email OTP, dùng layout inline-style chuẩn email client. */
export const buildOtpEmail = ({ otp, purpose, fullName, expiresMinutes }: OtpEmailParams) => {
  const { subject, heading, intro } = COPY[purpose];
  const shop = env.SHOP_NAME;
  const greeting = fullName ? `Xin chào ${fullName},` : "Xin chào,";
  const year = new Date().getFullYear();

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color:#111111;padding:28px 32px;text-align:center;">
              <span style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:1px;">${shop}</span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 8px;">
              <h1 style="margin:0 0 16px;font-size:20px;color:#111111;">${heading}</h1>
              <p style="margin:0 0 8px;font-size:15px;color:#444444;">${greeting}</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#444444;">${intro}</p>
              <!-- OTP box -->
              <div style="text-align:center;margin:0 0 24px;">
                <div style="display:inline-block;background-color:#f4f4f7;border:1px dashed #cccccc;border-radius:10px;padding:18px 32px;">
                  <span style="font-size:34px;font-weight:700;letter-spacing:10px;color:#111111;">${otp}</span>
                </div>
              </div>
              <p style="margin:0 0 8px;font-size:14px;color:#666666;line-height:1.6;">
                Mã có hiệu lực trong <strong>${expiresMinutes} phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#666666;line-height:1.6;">
                Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid #eeeeee;text-align:center;">
              <p style="margin:0;font-size:12px;color:#999999;">© ${year} ${shop}. Mọi quyền được bảo lưu.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject: `${subject} - ${shop}`, html };
};
