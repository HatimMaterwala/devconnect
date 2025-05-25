import { connectToDB } from "@/utils/database";
import Post from "@/models/Post";

export async function GET(req){
    try{
        const {searchParams} = new URL(req.url);
        const postId = searchParams.get('id');
        console.log(postId)

        if(!postId){
            return new Response(JSON.stringify('Invalid Input'),{status : 400});
        }

        await connectToDB();
        const post = await Post.findById(postId);

        if(!post){
            return new Response(JSON.stringify('Post not found in db!!'),{status : 404});
        }

        const output = {
            desc : post.description,
            image : post.image
        }

        return new Response(JSON.stringify(output),{status : 200})


    }catch(err){
        return new Response(JSON.stringify(`DB Error`),{status : 500});
    }
}