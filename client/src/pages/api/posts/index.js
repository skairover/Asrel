import { connectDB } from '@/lib/db';
import { verifyToken } from '@/utils/auth';
import User from '@/models/User'
import Post from '@/models/Post';

export default async function handler(req, res) {
  await connectDB();

  const { method } = req;

  switch (method) {
 case "GET":
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 }); // latest first
    return res.status(200).json(posts);
  } catch (err) {
    console.error("Fetch posts error:", err);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }


    case "POST":
      try {
        const user = verifyToken(req); // check if needs await
        if (!user) return res.status(401).json({ error: "Unauthorized" });

        const { title, content } = req.body;
        if (!title || !content) {
          return res.status(400).json({ error: "Title and content are required" });
        }

        const post = await Post.create({
          title,
          content,
          author: user.userId
        });
        return res.status(201).json(post);
      } catch (err) {
        console.error("Post creation error:", err);
        return res.status(400).json({ error: err.message || "invalid post data" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
