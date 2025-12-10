import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const userExistWithName = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (userExistWithName) {
      return Response.json(
        { success: false, message: "user already exists with this username" },
        { status: 400 }
      );
    }

    const userExistWithEmail = await UserModel.findOne({ email });

    // generating 6 digit OTP
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (userExistWithEmail) {
      if (userExistWithEmail.isVerified) {
        return Response.json(
          { success: false, message: "user already exists with this email" },
          { status: 400 }
        );
      } else {
        userExistWithEmail.password = await bcrypt.hash(password, 10);
        userExistWithEmail.verifyCode = verifyCode;
        userExistWithEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await userExistWithEmail.save();
      }
    } else {
      const hasedPassword = await bcrypt.hash(password, 10);
      const verifyCodeExpiry = new Date();
      verifyCodeExpiry.setHours(verifyCodeExpiry.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hasedPassword,
        verifyCode,
        verifyCodeExpiry,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // send verification email to user
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully, please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user ", error);

    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
