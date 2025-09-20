// app/api/send-notification/route.ts
import { messaging } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const { token, title, message, link } = await request.json();

    const payload = {
      token,
      notification: {
        title,
        body: message,
      },
      ...(link && {
        webpush: {
          fcmOptions: { link },
        },
      }),
    };

    const response = await messaging.send(payload);

    return new Response(JSON.stringify({ success: true, response }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("❌ Error sending message:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
