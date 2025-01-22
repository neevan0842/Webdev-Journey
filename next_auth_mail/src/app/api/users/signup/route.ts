import connect from "@/dbConfig/dbConfig";
import { sendEmail } from "@/helpers/mailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const {
      username,
      email,
      password,
    }: { username: string; email: string; password: string } =
      await request.json();

    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const savedUser = await User.findOne({ email }).select("-password");

    if (!savedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await sendEmail(email, "VERIFY", savedUser._id.toString());

    return NextResponse.json(
      {
        message: "User created successfully",
        user: savedUser,
        success: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
