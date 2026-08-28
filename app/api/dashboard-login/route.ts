import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (
      !process.env.DASHBOARD_PASSWORD ||
      password !== process.env.DASHBOARD_PASSWORD
    ) {
      return Response.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();

    cookieStore.set("dashboard_access", "granted", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12,
    });

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}