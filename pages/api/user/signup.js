import { NextResponse } from "next/server";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { signupValidator } from "@/validators/signupvalidator";
import { connectDB } from "@/lib/db";
export async function POST(request) {
  await connectDB();
  try {
    const body = await request.json();

    const userDetails = await signupValidator(body);
    console.log(userDetails.email);
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: userDetails.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Account already exists" },
        { status: 409 }
      );
    }
    // const hashedPassword = await bcrypt.hash(userDetails.password, 10);
    const user = new UserModel({
      email: userDetails.email,
      password: body.password,
    });
    await user.save();

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error", details: err.message },
      { status: 400 }
    );
  }
}
