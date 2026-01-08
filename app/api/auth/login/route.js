// app/api/auth/login/route.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectToDB } from "@/utils/database";

export async function POST(req) {
  const { email, password } = await req.json();
  await connectToDB();

  const user = await User.findOne({ email });
  if (!user || !user.password)
    return new Response("Invalid credentials", { status: 401 });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return new Response("Invalid credentials", { status: 401 });

  const token = jwt.sign(
    { id: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return new Response( JSON.stringify({
    user : {
      id : user._id,
      email : user.email,
      firstName : user.firstName,
      lastName : user.lastName,
      image : user.image || null,
    }
  }),{ 
    status: 200,
    headers: {
      "Content-Type" : "application/json",
      "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`
    },
  });
}
