import { connectToDB } from "@/utils/database";
import Post from "@/models/Post";
import User from "@/models/User";

export async function POST(req) {
  const { title, desc, id, imageUrl } = await req.json();
  console.log(title, desc, id, imageUrl);
  try {
    await connectToDB();
    if (title && desc && id) {
      const userExist = await User.findOne({ _id: id });
      if (userExist) {
        const newPost = await new Post({
          title,
          description: desc,
          author: id,
          image: imageUrl ? imageUrl : null,
        });
        await newPost.save();

        return new Response(JSON.stringify("Post Created Successfully"), {
          status: 201,
        });
      } else {
        return new Response(JSON.stringify("User not Exist !!"), {
          status: 404,
        });
      }
    } else {
      return new Response(JSON.stringify("Tilte or Description not found"), {
        status: 404,
      });
    }
  } catch (e) {
    return new Response(JSON.stringify("Database Error : " + e), {
      status: 500,
    });
  }
};

export async function GET(){
    try{
        await connectToDB();

        let newArray = [];

        const allPosts = await Post.find({}).sort({_id : -1}).populate('author','firstName lastName image bio followers');

        allPosts.forEach((post) => {
          let plainpost = post.toObject();
          plainpost.timestamp = post._id.getTimestamp();
          newArray.push(plainpost);
        })
        
        if(allPosts){
          console.log("Fetched Posts Successfully - Backend");
            return new Response(JSON.stringify(newArray),{status : 200});
        }else{
          console.log("No Posts Found - Backend");
            return new Response(JSON.stringify("Posts not found"),{status : 404});
        }

    }catch(e){
        return new Response(JSON.stringify(e.message),{status : 500})
    }
}
