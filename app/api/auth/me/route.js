import User from "@/models/User";
import { connectToDB } from "@/utils/database";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET() {
    const token = (await cookies()).get("token")?.value;
    if(!token) return new Response(JSON.stringify('Token Not Found'),{status : 401});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await connectToDB();
        
        const user = await User.findById(decoded.id).select("_id email firstName lastName image");

        if(!user) return new Response(JSON.stringify("User not found!!"),{status : 404})

        return new Response(JSON.stringify({
            user : {
                id : user._id,
                email : user.email,
                firstName : user.firstName,
                lastName : user.lastName, 
                image : user.image || null 
            }
        }),{status : 201})
    }catch(err){
        return new Response(JSON.stringify(err),{status : 401})
    }
}