import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import z, { success } from "zod"; // !POSSIBLE ERROR => z to {z}

const usernameQuesrySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = usernameQuesrySchema.safeParse(queryParam);
    console.log(result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "invalid username format",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const exisitingVerifeidUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (exisitingVerifeidUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error validating username", error);

    return Response.json(
      {
        success: false,
        message: "Error validating username",
      },
      { status: 500 }
    );
  }
}
