import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/utils/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method Not Allowed",
    });
  }

  await connectDB();

  try {
    const user = verifyToken(req);

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(200).json([]);
    }

    const users = await User.find({
      _id: { $ne: user.userId },
      name: {
        $regex: q,
        $options: "i",
      },
    })
      .select("name avatar isOnline")
      .limit(20);

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}