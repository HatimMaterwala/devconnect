import { connectToDB } from "@/utils/database";
import User from "@/models/User";

export default async function POST(req) {
    try{
        await connectToDB();
        

    }catch(e){
        console.log("DB Error : " + e);
        return new Response(JSON.stringify("Database Error : " + e.message),{status : 500});
    }
}