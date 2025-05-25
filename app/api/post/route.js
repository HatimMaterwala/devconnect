import { connectToDB } from "@/utils/database";
import Post from "@/models/Post";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  const { desc, id, imageUrl } = await req.json();
  console.log(desc, id, imageUrl);
  try {
    await connectToDB();
    if (desc && id) {
      const userExist = await User.findOne({ _id: id });
      if (userExist) {
        // Creating New Post
        const newPost = await new Post({
          description: desc,
          author: id,
          image: imageUrl ? imageUrl : null,
        });
        await newPost.save();

        // Add Post to the User Model
        userExist.posts.push(newPost._id);
        await userExist.save();

        return new Response(JSON.stringify("Post Created Successfully"), {
          status: 201,
        });
      } else {
        return new Response(JSON.stringify("User not Exist !!"), {
          status: 404,
        });
      }
    } else {
      return new Response(JSON.stringify("Content not found"), {
        status: 404,
      });
    }
  } catch (e) {
    return new Response(JSON.stringify("Database Error : " + e), {
      status: 500,
    });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");

  try {
    await connectToDB();

    let newArray = [];

    let userExists = await User.findById(userId);

    if (!userExists) {
      return new Response(JSON.stringify("User Not Found"), { status: 404 });
    }

    const liked = userExists.likedPosts;

    const allPosts = await Post.find({})
      .sort({ _id: -1 })
      .populate("author", "firstName lastName image bio followers")
      .populate("comments.id", "image firstName lastName");
    allPosts.forEach((post) => {
      let plainpost = post.toObject();
      plainpost.timestamp = post._id.getTimestamp();
      newArray.push(plainpost);
    });

    if (allPosts) {
      console.log("Fetched Posts Successfully - Backend");
      return new Response(JSON.stringify({ posts: newArray, liked: liked }), {
        status: 200,
      });
    } else {
      console.log("No Posts Found - Backend");
      return new Response(JSON.stringify("Posts not found"), { status: 404 });
    }
  } catch (e) {
    return new Response(JSON.stringify("Server Error : " + e.message), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    try {
      const deleteResult = await Post.deleteOne({ _id: id });

      if (deleteResult.deletedCount === 1) {
        return new Response(JSON.stringify("Post Deleted Successfully!!"), {
          status: 200,
        });
      } else {
        return new Response(JSON.stringify("Post Not Found !!"), {
          status: 404,
        });
      }
    } catch (e) {
      return new Response(JSON.stringify("DB Error : " + e), { status: 500 });
    }
  }

  return new Response(JSON.stringify("Id not found"), { status: 404 });
}

export async function PUT(req) {
  try {
    // Check for session
    const session = await getServerSession(authOptions);
    console.log(session)
    if (!session?.user?.id) {
      return new Response(JSON.stringify(`Unauthorized`), { status: 401 });
    }

    // Check For Defined Input
    const { id, gotDescription, gotImage } = await req.json();
    if (
      !id ||
      typeof gotDescription !== "string" ||
      typeof gotImage !== "string"
    ) {
      return new Response(JSON.stringify("Invalid input"), { status: 400 });
    }

    await connectToDB();
    const post = await Post.findById(id);
    if (!post) {
      return new Response(JSON.stringify("Post Not Found !!"), { status: 404 });
    }
    if (post.author.toString() !== session.user.id) {
      return new Response("Forbidden: Not your post", { status: 403 });
    }
    (post.description = gotDescription),
      (post.image = gotImage),
      await post.save();
    return new Response(JSON.stringify("Post Updated Successfully!!"), {
      status: 200,
    });

  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify("DB Error | Server Error"), {
      status: 500,
    });
  }
}
