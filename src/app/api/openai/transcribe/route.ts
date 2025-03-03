import { NextResponse } from "next/server";
import fs from "fs";
import OpenAI from "openai";

// Check if OpenAI API key exists
const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function POST(req: Request) {
  // Return an error if OpenAI is not configured
  if (!openai) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 501 }
    );
  }

  const body = await req.json();
  const base64Audio = body.audio;

  // Convert the base64 audio data to a Buffer
  const audio = Buffer.from(base64Audio, "base64");

  // Define the file path for storing the temporary WAV file
  const filePath = "tmp/input.wav";

  try {
    // Make sure tmp directory exists
    if (!fs.existsSync("tmp")) {
      fs.mkdirSync("tmp", { recursive: true });
    }

    // Write the audio data to a temporary WAV file synchronously
    fs.writeFileSync(filePath, audio as unknown as Buffer);

    // Create a readable stream from the temporary WAV file
    const readStream = fs.createReadStream(filePath);

    const data = await openai.audio.transcriptions.create({
      file: readStream,
      model: "whisper-1",
    });

    // Remove the temporary file after successful processing
    fs.unlinkSync(filePath);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error processing audio:", error);
    // Clean up temporary file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return NextResponse.json(
      {
        error: "Audio transcription failed",
        details: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
