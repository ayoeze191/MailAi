import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { signupValidator } from "@/validators/signupvalidator";
import { connectDB } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // await connectDB();

  try {
    const body = req.body;

    const userDetails = await signupValidator(body);
    console.log(userDetails.email);

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: userDetails.email });
    if (existingUser) {
      return res.status(409).json({ error: "Account already exists" });
    }

    // Hash password before saving (recommended)
    // const hashedPassword = await bcrypt.hash(userDetails.password, 10);

    const user = new UserModel({
      email: userDetails.email,
      password: body.password, // Consider hashing password here!
    });

    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res.status(400).json({
      error: "Unexpected error",
      details: err.message,
    });
  }
}
