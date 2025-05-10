import { connectToDB } from "@/utils/database";
import Post from "@/models/Post";
import mongoose from "mongoose";
import User from "@/models/User";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const request = searchParams.get("request");
  const userId = searchParams.get("user");

  if (
    !mongoose.Types.ObjectId.isValid(id) &&
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    return new Response(JSON.stringify("Invalid ID"), { status: 400 });
  }

  try {
    if (id && request && userId) {
      await connectToDB();

      if (request.toLowerCase().startsWith("l")) {
        const results = await Post.updateOne(
          { _id: id },
          { $inc: { likes: 1 } }
        );

        if (results.matchedCount === 1) {
          const updateUser = await User.updateOne(
            { _id: userId },
            { $addToSet: { likedPosts: id } }
          );

          if (updateUser.matchedCount === 1) {
            return new Response(JSON.stringify("Liked Successfully !!"), {
              status: 200,
            });
          } else {
            return new Response(JSON.stringify("User Not Found"), {
              status: 404,
            });
          }
        }
      } else {
        const results = await Post.updateOne(
          { _id: id },
          { $inc: { likes: -1 } }
        );

        if (results.matchedCount === 1) {
          const updateUser = await User.updateOne(
            { _id: userId },
            { $pull: { likedPosts: id } }
          );

          if (updateUser.matchedCount === 1) {
            return new Response(JSON.stringify("Unliked Successfully !!"), {
              status: 200,
            });
          } else {
            return new Response(JSON.stringify("User Not Found"), {
              status: 404,
            });
          }
        }
      }
    } else {
      console.log("SearchParams Not Found !!");
      return new Response(JSON.stringify("SearchParams Not Found !!"), {
        status: 404,
      });
    }
  } catch (e) {
    return new Response(JSON.stringify("DB/Logic Error"), { status: 500 });
  }
}
