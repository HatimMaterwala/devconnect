import { connectToDB } from "@/utils/database";
import User from "@/models/User";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    await connectToDB();
    const userExists = await User.findOne({ _id: id });
    if (userExists) {
      const { firstName, lastName, email, image } = userExists;
      const joinedDate = userExists._id.getTimestamp();
      const cleanUser = { firstName, lastName, email, image, joined: joinedDate.toISOString()};
      return new Response(JSON.stringify(cleanUser), { status: 200,
        headers : {"Content-Type" : "application/json"}
       });
    } else {
      return new Response(JSON.stringify("User not found"), { status: 404 });
    }
  } catch (e) {
    return new Response(JSON.stringify("Database Error"), { status: 500 });
  }
}
