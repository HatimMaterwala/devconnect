import { connectToDB } from "@/utils/database";
import User from "@/models/User";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    try {
      await connectToDB();  
      const sessionUser = await User.findById(id).populate('followers', 'firstName lastName image');
      if (sessionUser) {
        let followerDetails = await sessionUser.followers;
        return new Response(JSON.stringify(followerDetails), { status: 200 });
      }
    } catch (e) {
      return new Response(JSON.stringify("Logic or DB Error : " + e.message));
    }
  } else {
    return new Response(JSON.stringify("Undefined SearchParams !!"), {
      status: 500,
    });
  }
}
