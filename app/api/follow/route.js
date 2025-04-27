import { connectToDB } from "@/utils/database";
import User from "@/models/User";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  console.log("From : " + from + " To : " + to + "\n");

  if (from === to) {
    return new Response(JSON.stringify("Cannot Follow your own ID"), {
      status: 201,
    });
  }

  try {
    await connectToDB();

    const followingUser = await User.findOne({ _id: from });
    const followedUser = await User.findOne({ _id: to });

    console.log("Following User : " + followingUser + " Followed User : " + followedUser + "\n");

    if (followingUser) {
      const alreadyFollowed = await followingUser.following.includes(to);
      
      if (alreadyFollowed) {
        return new Response(JSON.stringify("Already Followed"), {
          status: 201,
        });
      } else {
        followingUser.following.push(to);
        followedUser.followers.push(from);
        await followingUser.save();
        await followedUser.save();

        return new Response(JSON.stringify("User Followed Successfully!"), {
          status: 200,
        });
      }
    }
  } catch (e) {
    console.log("DB Error : " + e);
    return new Response(JSON.stringify("Database Error : " + e.message), {
      status: 500,
    });
  }
}

export async function GET() {
  try{
    await connectToDB();

  }catch(e){
    console.log(e.message);
    return new Response(JSON.stringify("DB Error From Follow GET : " + e.message),{status : 500});
  }
}
