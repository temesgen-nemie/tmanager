import dotenv from "dotenv";
import { Router } from "express";
import { register, login } from "../controllers/authController";
import axios from "axios";
import queryString from "query-string";
import User from "../models/User";
import jwt from "jsonwebtoken";
import crypto from 'crypto';


dotenv.config(); // MUST BE BEFORE USING process.env

console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("GOOGLE_REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI);

const router = Router();

// Email/password routes
router.post("/register", register);
router.post("/login", login);

// Google OAuth
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

// Step 1: Redirect user to Google login
router.get("/google", (_, res) => {
  const scope = ["profile", "email"].join(" ");
  const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?${queryString.stringify({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope,
    access_type: "offline",
    prompt: "consent",
  })}`;

  res.redirect(redirectUrl);
});

// Step 2: Google redirects back with code
// Step 2: Google redirects back with code
router.get('/google/callback', async (req, res) => {
  const code = req.query.code as string;
  console.log("🚀 CODE FROM GOOGLE:", code); // <--- Check if code exists

  if (!code) {
    return res.status(400).json({ message: "No code returned from Google!" });
  }

  try {
    // Exchange code for tokens
    const { data } = await axios.post(
      'https://oauth2.googleapis.com/token',
      queryString.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    console.log("🔑 ACCESS TOKEN:", data.access_token);

    // Get user info from Google
    const googleUser = await axios.get(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      { headers: { Authorization: `Bearer ${data.access_token}` } }
    );

    console.log("👤 GOOGLE USER:", googleUser.data);

    // Check if user exists
    let user = await User.findOne({ email: googleUser.data.email });
    if (!user) {
      user = await User.create({
        name: googleUser.data.name,
        email: googleUser.data.email,
        password: crypto.randomBytes(16).toString('hex'),
      });
    }

    // Check JWT_SECRET first
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing in .env");
      return res.status(500).json({ message: "Server error: missing JWT_SECRET" });
    }

    // Generate JWT token
   const token = jwt.sign(
  {
    id: user._id,
    name: user.name,
    email: user.email,
  },
  process.env.JWT_SECRET!,
  { expiresIn: "1h" }
);

    console.log("🧾 JWT TOKEN:", token);

    // Build redirect URL
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${token}`;
    console.log("🔁 REDIRECT URL:", redirectUrl);

    // Finally redirect!
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("🔥 GOOGLE OAUTH ERROR:", err);
    res.status(500).json({ message: "Google OAuth failed", error: err });
  }
});


export default router;
