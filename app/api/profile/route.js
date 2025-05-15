import { connectToDB } from "@/utils/database";
import User from "@/models/User";
import Post from "@/models/Post";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    await connectToDB();
    const userExists = await User.findOne({ _id: id }).populate('posts', '_id description image timestamp likes');
    const userPosts = await Post.find({author : id}).populate('author','firstName lastName image')
    .populate('comments._id','firstName lastName image');

    if (userExists && userPosts) {
      const { firstName, lastName, email, image, likedPosts } = userExists;

      let allDate = [];
      userPosts.forEach((onePost)=>{
        allDate.push(onePost._id.getTimestamp());
      });
      
      const joinedDate = userExists._id.getTimestamp();
      const cleanUser = { firstName, lastName, email, image, userPosts, allDate, likedPosts, joined: joinedDate.toISOString()};
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
