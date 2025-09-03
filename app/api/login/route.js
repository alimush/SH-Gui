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

    // ابحث عن اليوزر
    const user = await User.findOne({
      username: body.username,
      password: body.password,
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "Invalid username or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ✅ إذا اليوزر صحيح → خزن كوكي
    cookies().set("loggedIn", "true", {
      httpOnly: true,   // يمنع التلاعب من الجافاسكربت
      path: "/",
      maxAge: 60 * 60,  // ساعة وحدة
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
