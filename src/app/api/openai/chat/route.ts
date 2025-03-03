import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  // Check if OpenAI API key exists
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: "OpenAI API key not configured",
      }),
      {
        status: 501,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  try {
    const { messages } = await req.json();
    const result = await streamText({
      model: openai("gpt-4o"),
      messages: convertToCoreMessages(messages),
      system: "You are a helpful AI assistant",
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error("Error in OpenAI chat:", error);
    return new Response(
      JSON.stringify({
        error: "Chat request failed",
        details: error?.message || "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
