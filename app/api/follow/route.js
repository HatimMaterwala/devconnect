import { connectToDB } from "@/utils/database";
import User from "@/models/User";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const request = searchParams.get("request");

  console.log(
    "From : " + from + " To : " + to + " Request : " + request + "\n"
  );

  if (from === to) {
    console.log("Cannot Follow your own ID");
    return new Response(JSON.stringify("Cannot Follow your own ID"), {
      status: 201,
    });
  }

  try {
    await connectToDB();
    const followingUser = await User.findOne({ _id: from });
    const followedUser = await User.findOne({ _id: to });

    if (request && request.toLowerCase() === "follow") {
      if (followingUser) {
        const alreadyFollowed = await followingUser.following.includes(to);

        if (alreadyFollowed) {
          console.log("Already Followed");
          return new Response(JSON.stringify("Already Followed"), {
            status: 201,
          });
        } else {
          followingUser.following.push(to);
          followedUser.followers.push(from);
          await followingUser.save();
          await followedUser.save();

          console.log("User Followed Successfully!");

          return new Response(JSON.stringify("User Followed Successfully!"), {
            status: 200,
          });
        }
      }else{
        console.log("User Not Found Error !!");
        return new Response(JSON.stringify("User Not Found!!"),{status : 201});
      }
    } else {
      if (followingUser) {
        const alreadyFollowed = followingUser.following.includes(to);

        if (alreadyFollowed) {
          let fingUser = followingUser.following.filter((id) => id != to);
          let fedUser = followedUser.followers.filter((id) => id != from);

          followedUser.following = fingUser;
          followingUser.followers = fedUser;

          await followingUser.save();
          await followedUser.save();

          console.log("User Removed Successfully !!")

          return new Response(JSON.stringify("User Removed Successfully !!"),{status : 200});
        }
      }
    }
  } catch (e) {
    console.log("DB Error : " + e);
    return new Response(JSON.stringify("Database Error : " + e.message), {
      status: 500,
    });
  }
}
