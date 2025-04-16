import { connectToDB } from "@/utils/database";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(req){
    try{
        const {firstName, lastName, email, password} = await req.json();
        await connectToDB();

        const userExists = await User.findOne({email});

        if(userExists){
            return new Response("User already exists!!",{status : 400});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        await User.create({
            firstName,
            lastName,
            email,
            password : hashedPassword
        })
        return new Response("User created Successfully!!",{status: 201});
        
    }catch(e){
        console.log(e)
        return new Response(e.message, {status : 500})
    }


}