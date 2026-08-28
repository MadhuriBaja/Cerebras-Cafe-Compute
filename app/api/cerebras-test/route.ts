import { cerebras } from "@/lib/cerebras";

export async function GET() {
  try {
    await cerebras.chat.completions.create({
      model: "gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: "Reply with exactly: Cerebras connection successful",
        },
      ],
    });

    return Response.json({
      success: true,
      response: "Cerebras connection successful",
    });
  } catch (error) {
    console.error("Cerebras test error:", error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}