import { connectToDB } from "@/utils/database";
import User from "@/models/User";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    try {
      await connectToDB();  
      const sessionUser = await User.findById(id).populate('following', 'firstName lastName image');
      if (sessionUser) {
        let followingDetails = await sessionUser.following;
        console.log(followingDetails); 
        return new Response(JSON.stringify(followingDetails), { status: 200 });
      }
    } catch (e) {
      return new Response(JSON.stringify("Logic or DB Error : " + e.message));
    }
  } else {
    return new Response(JSON.stringify("Undefined SearchParams !!"), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  const {searchParams}  = new URL(req.url);
  const userId = searchParams.get('userid');
  const deleteId = searchParams.get('deleteid');

  if(!userId || !deleteId){
    return new Response(JSON.stringify('Invalid Input'),{status : 400});
  }

  try{
    const realUser = await User.findById(userId);

    if(!realUser){
      return new Response(JSON.stringify('User Not Found in DB!!'),{status : 404});
    }

    const results = await User.updateOne({_id : userId},{
      $pull : {following : deleteId}
    })

    const result2 = await User.updateOne({_id : deleteId},{
      $pull : {followers : userId}
    })

    if(results.modifiedCount !== 1 || result2.modifiedCount !== 1 ){
      return new Response(JSON.stringify('User not found'),{status : 404})
    }

    return new Response(JSON.stringify('User updated Successfully'),{status : 200});

  }catch(e){
    return new Response(JSON.stringify('DB Error | Server Error'),{status : 500});
  }
}
