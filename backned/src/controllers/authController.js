const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

function signToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

async function signup(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hash,
        role: role || "warehouse_staff",
      },
    });

    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user);
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// --- OTP for Password Reset Flow ---
// Request a one-time code to reset password. For security we respond with a generic message
// even if the email is not registered. For development we still log and return the code.
async function requestOtp(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Missing email" });

    const code = generateCode();
    const ttl = Number(process.env.OTP_TTL_SECONDS) || 600; // default 10 minutes
    const expiresAt = new Date(Date.now() + ttl * 1000);
    // rate-limit: disallow requests more frequently than OTP_RATE_LIMIT_SECONDS
    const rateLimitSeconds = Number(process.env.OTP_RATE_LIMIT_SECONDS) || 60;
    const last = await prisma.otp.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });
    if (last) {
      const diff = (Date.now() - new Date(last.createdAt).getTime()) / 1000;
      if (diff < rateLimitSeconds) return res.status(429).json({ error: "Too many requests" });
    }

    const otp = await prisma.otp.create({ data: { email, code, expiresAt } });

    // Try sending email if SMTP is configured
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_FROM) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        const mail = {
          from: process.env.SMTP_FROM,
          to: email,
          subject: "Your StockMaster password reset code",
          text: `Your password reset code is: ${code}. It expires at ${expiresAt.toISOString()}`,
        };

        await transporter.sendMail(mail);
      } else {
        console.log(`Password reset OTP for ${email}: ${code} (expires ${expiresAt.toISOString()})`);
      }
    } catch (sendErr) {
      console.error("Failed to send OTP email:", sendErr);
    }

    // Generic response to avoid account enumeration; reveal code only in non-production for dev convenience.
    const response = { ok: true, message: "If an account exists, a reset code was sent" };
    if (process.env.NODE_ENV !== "production") response.code = code;
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// Verify OTP and reset the user's password. Requires `newPassword` in the body.
async function verifyOtp(req, res) {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) return res.status(400).json({ error: "Missing fields" });

    const now = new Date();
    const otp = await prisma.otp.findFirst({
      where: {
        email,
        code,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) return res.status(400).json({ error: "Invalid or expired code" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "No user with that email" });

    // Perform password update and OTP removal in a transaction to avoid reuse/race
    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.$transaction([
      prisma.user.update({ where: { email }, data: { passwordHash: hash } }),
      // delete only OTPs matching this email/code (one-time use)
      prisma.otp.deleteMany({ where: { email, code } }),
    ]);

    res.json({ ok: true, message: "Password has been reset" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  signup,
  login,
  requestOtp,
  verifyOtp,
  // profile & account
  getProfile,
  updateProfile,
  changePassword,
  logout,
};

// --- Profile / Account handlers ---
async function getProfile(req, res) {
  try {
    const id = req.user?.userId;
    if (!id) return res.status(401).json({ error: "Unauthorized" });
    const user = await prisma.user.findUnique({ where: { id: Number(id) }, select: { id: true, name: true, email: true, role: true } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function updateProfile(req, res) {
  try {
    const id = req.user?.userId;
    if (!id) return res.status(401).json({ error: "Unauthorized" });
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Missing name" });
    const updated = await prisma.user.update({ where: { id: Number(id) }, data: { name } });
    res.json({ user: { id: updated.id, name: updated.name, email: updated.email, role: updated.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function changePassword(req, res) {
  try {
    const id = req.user?.userId;
    if (!id) return res.status(401).json({ error: "Unauthorized" });
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ error: "Missing fields" });
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) return res.status(404).json({ error: "User not found" });
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return res.status(400).json({ error: "Invalid current password" });
    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: Number(id) }, data: { passwordHash: hash } });
    res.json({ ok: true, message: "Password updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

async function logout(req, res) {
  // stateless JWT: frontend should remove token. Provide a consistent response.
  res.json({ ok: true });
}
