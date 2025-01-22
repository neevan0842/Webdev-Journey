import connect from "@/dbConfig/dbConfig";
import { getDatafromToken } from "@/helpers/getDatafromToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(request: NextRequest) {
  try {
    const userid = await getDatafromToken(request);

    const user = await User.findById({ _id: userid }).select(
      "-password -isAdmin -__v"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "User found", data: user },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
