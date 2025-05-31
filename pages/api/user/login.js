import { NextResponse } from "next/server";
import UserModel from "@/model/User.model";
import { connectDB } from "@/lib/db";
import { signLogin } from "@/jwt/sign";

export async function POST(request) {
  await connectDB();
  const body = await request.json();
  console.log(body);

  const user = await UserModel.findOne({ email: body.email });

  if (!user) {
    return NextResponse.json(
      { error: "You do not have an account with us" },
      { status: 404 }
    );
  }

  if (!user.password) {
    return NextResponse.json(
      { error: "This account uses Google login. Use Google Sign-In." },
      { status: 400 }
    );
  }
  const correctPassword = await user.comparePassword(body.password);

  if (!correctPassword) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const tokenData = signLogin(user._id, user.email);

  return NextResponse.json(
    {
      message: "Login successful",
      data: {
        token: tokenData,
        user,
      },
    },
    { status: 200 }
  );
}
