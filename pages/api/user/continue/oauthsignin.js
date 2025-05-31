import admin from "@/firebase/admin";
import UserModel from "@/model/User.model";
import { connectDB } from "@/lib/db";
import { signLogin } from "@/jwt/sign";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // await connectDB();

  try {
    const { token } = req.body;

    const gUser = await admin.auth().verifyIdToken(token);

    if (!gUser) {
      return res.status(401).json({ message: "Signin failed" });
    }

    const existingUser = await UserModel.findOne({ email: gUser.email });

    if (!existingUser) {
      const newUser = new UserModel({
        email: gUser.email,
        emailVerified: gUser.email_verified || true,
        profileImage: gUser.picture || "",
        password: gUser.uid, // consider your security strategy here
        authMethod: gUser.firebase.sign_in_provider.includes("apple")
          ? "apple"
          : "google",
        authMethodId: gUser.uid,
      });

      await newUser.save();

      const tokens = signLogin(newUser._id, newUser.email);

      return res.status(200).json({
        message: "Successfully logged in",
        data: {
          isNewUser: true,
          token: tokens,
          user: newUser,
        },
      });
    }

    existingUser.authMethodId = gUser.uid;
    existingUser.authMethod = gUser.firebase.sign_in_provider.includes("apple")
      ? "apple"
      : "google";
    existingUser.emailVerified = gUser.email_verified;
    await existingUser.save();

    const tokens = signLogin(existingUser._id, existingUser.email);

    return res.status(200).json({
      message: "Successfully logged in",
      data: {
        isNewUser: false,
        token: tokens,
        user: existingUser,
      },
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Unexpected error", details: error.message });
  }
}
