// /api/send-code.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "请输入有效邮箱地址" });
  }

  // 随机生成验证码（6位数字）
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // SMTP 配置：QQ邮箱
  const transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "【SelectNExplain】您的验证码",
      text: `您好，您的验证码是：${code}，5分钟内有效。`,
    });

    // ⚠️ 这里可以将验证码保存到内存/数据库，这里先跳过
    return res.status(200).json({ message: "验证码已发送" });
  } catch (err) {
    console.error("❌ 邮件发送失败", err);
    return res.status(500).json({ message: "发送失败，请稍后再试" });
  }
}
