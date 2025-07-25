// /api/register.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, code } = req.body;

  // 简单校验
  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "请输入有效邮箱地址" });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: "密码长度不能少于6位" });
  }
  if (!code || code.length !== 6) {
    return res.status(400).json({ message: "请输入6位验证码" });
  }

  // TODO：这里你应该从数据库或缓存中校验验证码是否正确
  // 目前演示阶段直接返回成功，方便前端联调
  console.log("收到注册请求", { email, password, code });

  return res.status(200).json({ message: "注册成功" });
}
