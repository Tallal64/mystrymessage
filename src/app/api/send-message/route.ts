import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username, message } = await request.json();
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessages) {
      return Response.json(
        { success: false, message: "User is not accepting messages" },
        { status: 403 }
      );
    }

    const newMessage = { message, createdAt: new Date() };
    user.messages.push(newMessage as unknown as Message);
    await user.save();

    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending message from backend:", error);
    return Response.json(
      { success: false, message: "Error sending message" },
      { status: 500 }
    );
  }
}
