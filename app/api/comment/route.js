import { connectToDB } from "@/utils/database";
import User from "@/models/User";
import Post from "@/models/Post";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userid");
  const postId = searchParams.get("postid");
  const {comment} = await req.json();

  if (userId && postId) {
    try {
      await connectToDB();
      const userExists = await User.findById(userId);
      const postExists = await Post.findById(postId);

      if (userExists && postExists) {
        const commentResult = await Post.updateOne(
          { _id: postId },
          { $addToSet: { comments: { id: userId, wrote: comment.trim(), createdAt : new Date() }}}
        );

        if (commentResult.matchedCount === 1) {
          return new Response("Comment Successfull", { status: 200 });
        } else {
          return new Response("Comment Successfull", { status: 200 });
        }
      }

      return new Response(JSON.stringify("Id not Found in DB"), {
        status: 404,
      });

    } catch (e) {
      return new Response(JSON.stringify("DB Error - " + e.message), {
        status: 500,
      });
    }
  } else {
    return new Response(JSON.stringify("Missing userID or postId"), { status: 400 });
  }
}
