import { NextResponse } from "next/server";
import { messaging } from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    const { token, title, message, link } = await req.json();

    const payload = {
      token,
      notification: {
        title,
        body: message,
      },
      webpush: {
        fcmOptions: {
          link,
        },
      },
    };

    const response = await messaging.send(payload);
    return NextResponse.json({ success: true, response });
  } catch (err: any) {
    console.error("❌ Error sending message:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
