import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { connectDB } from "@/lib/db"; 
import User from "@/models/User";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { token } = req.body;

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // backend always uses non-public one
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        googleId: sub,
        email,
        name,
        avatar: picture,
      });
    }

    // Generate JWT
    const authToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ token: authToken, user });
  } catch (err) {
    console.error("Google Auth Error:", err.message, err.stack);
    return res.status(500).json({ message: "Google login failed" });
  }
}
