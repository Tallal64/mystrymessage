import { streamText, UIMessage, convertToModelMessages } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  try {
    // Parse input
    const { messages }: { messages: UIMessage[] } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing messages" }),
        { status: 400 }
      );
    }
    // Execute model stream
    const result = streamText({
      model: google("gemini-2.0-flash-lite"),
      prompt: "Invent a new holiday and describe its traditions.",
      maxOutputTokens: 256,
    });

    // Stream back to client
    return result.toUIMessageStreamResponse();
  } catch (error) {
    // TODO: check for AI-SDK specific errors
    if (error instanceof google) {
      console.error("Google AI error:", error);
    } else {
      console.error("AI stream failure:", error);
      return new Response(
        JSON.stringify({
          error: "Internal server error",
        }),
        { status: 500 }
      );
    }
  }
}
