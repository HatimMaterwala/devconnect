import { connectToDB } from "@/utils/database";
import bcyrpt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "@/models/User";

export async function POST (req) {
    try{
        await connectToDB();
        const { firstName, lastName, email, password } = await req.json();
        console.log(firstName, lastName, email, password);
        const userExists = await User.findOne({email});

        console.log(userExists);

        if(userExists) return new Response(JSON.stringify('User Already Exists'),{status : 404});

        const hashedPass = await bcyrpt.hash(password,10);

        const newUser = await User.create({
            firstName,
            lastName, 
            email,
            password : hashedPass
        })

        const token = jwt.sign({id : newUser._id, email},process.env.JWT_SECRET,{
            expiresIn : "7d"
        })

        return new Response(JSON.stringify({
            user : {
                id : newUser._id,
                email : newUser.email,
                firstName : newUser.firstName,
                lastName : newUser.lastName,
                image : newUser.image || null
            }
        }),{
            status : 200,
            headers : {
                "Set-Cookie" : `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax`
            }
        })
    }catch(err){
        return new Response(JSON.stringify('Server Error : ' + err),{status : 500});
    }
}