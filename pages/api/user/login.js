// import dbConnect from "@/lib/db";

import UserModel from "@/model/User.model";
import { signLogin } from "@/jwt/sign";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // await dbConnect();

  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(404).json({
      error: "You do not have an account with us",
    });
  }

  if (!user.password) {
    return res.status(400).json({
      error: "This account uses Google login. Use Google Sign-In.",
    });
  }

  const correctPassword = await user.comparePassword(password);

  if (!correctPassword) {
    return res.status(401).json({
      error: "Invalid email or password",
    });
  }

  const token = signLogin(user._id, user.email);

  return res.status(200).json({
    message: "Login successful",
    data: {
      token,
      user,
    },
  });
}
