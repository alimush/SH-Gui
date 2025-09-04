import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import { cookies } from "next/headers";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ⚠️ لاحقاً استعمل bcrypt
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { username, password } = body || {};

    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Username/Password required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const user = await User.findOne({ username, password });

    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid username or password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ لازم await هنا
    const cookieStore = await cookies();
    cookieStore.set("loggedIn", "true", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60, // ساعة
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message || "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
