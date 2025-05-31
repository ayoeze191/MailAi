import admin from "@/firebase/admin";
import { NextResponse } from "next/server";
import UserModel from "@/model/User.model";
import { connectDB } from "@/lib/db";
import { signLogin } from "@/jwt/sign";

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  const token = body.token;
  const gUser = await admin.auth().verifyIdToken(token);
  if (!gUser) {
    return NextResponse.json({
      status: 401,
      message: "Signin failed",
    });
  }
  const existingUser = await UserModel.findByEmail(gUser.email);
  if (!existingUser) {
    const newUser = new UserModel({
      email: gUser.email,
      emailVerified: gUser.email_verified || true,
      profileImage: gUser.picture || "",
      password: gUser.uid,
      authMethod: gUser.firebase.sign_in_provider.includes("apple")
        ? "apple"
        : "google",
      authMethodId: gUser.uid,
    });
    await newUser.save();
    const tokens = signLogin(newUser._id, newUser.email);
    return NextResponse.json({
      status: 200,
      message: "Sucessfully logged in",
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
  const tokens = signLogin(existingUser._id, existingUser.email);
  return NextResponse.json({
    status: 200,
    message: "Sucessfully logged in",
    data: {
      isNewUser: true,
      token: tokens,
      user: existingUser,
    },
  });
}
