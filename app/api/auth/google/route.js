// app/api/auth/google/route.js
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "@/models/User";
import { connectToDB } from "@/utils/database";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req) {
  const { token } = await req.json();
  await connectToDB();

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const { email, given_name, family_name, picture } = ticket.getPayload();

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      firstName: given_name,
      lastName: family_name,
      image: picture,
    });
  }

  const jwtToken = jwt.sign(
    { id: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return new Response("OK", {
    headers: {
      "Set-Cookie": `token=${jwtToken}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`
    }
  });
}
