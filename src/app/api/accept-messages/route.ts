import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";

// API route to accept or decline messages
export async function POST(request: Request) {
  await dbConnect();

  // Get the user session (not the actual user but the session) from NextAuth for currently logged-in user
  const session = await getServerSession(authOptions);

  const user: User = session?.user;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update user status to accept messages:",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "message acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("failed to update user status to accept messages:", error);

    return Response.json(
      {
        success: false,
        message: "message acceptance update failed",
      },
      { status: 500 }
    );
  }
}

// API route to get the current user's message acceptance status
export async function GET(request: Request) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        { status: 401 }
      );
    }

    const userId = user._id;

    const userFound = await UserModel.findById(userId);

    if (!userFound) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: userFound.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving user message acceptance status:", error);
    return Response.json(
      {
        success: false,
        message: "Error retrieving user message acceptance status",
      },
      { status: 500 }
    );
  }
}
