import User from "../models/User.js";

export async function searchUsers(req, res) {
  try {
    const query = req.query.q || "";

    const users = await User.find({
      name: {
        $regex: query,
        $options: "i",
      },
      _id: {
        $ne: req.user.userId,
      },
    })
      .select("-password")
      .limit(20);

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}