// /api/send-code.js

import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Missing email" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // 配置 Gmail 发件邮箱
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "你的 Gmail 地址",         // ✅ 改成你的邮箱，比如 xxx@gmail.com
      pass: process.env.GMAIL_APP_PASSWORD, // ✅ Vercel 中配置的 Gmail 应用专用密码
    },
  });

  try {
    await transporter.sendMail({
      from: "你的 Gmail 地址",         // ✅ 同上
      to: email,
      subject: "SelectNExplain 验证码",
      text: `你的验证码是：${code}，10 分钟内有效。`,
    });

    // 将验证码和邮箱存在缓存（简单实现）
    global.codes = global.codes || {};
    global.codes[email] = { code, expires: Date.now() + 10 * 60 * 1000 };

    res.status(200).json({ message: "验证码已发送" });
  } catch (error) {
    console.error("发送失败：", error);
    res.status(500).json({ message: "发送失败，请稍后再试" });
  }
}
