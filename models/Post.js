import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    description : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : false
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    likes : {
        type : Number,
        required : true,
        default : 0
    },
    comments : {
        type : Array,
        required : false
    },
    commentCount : {
        type : Number,
        required : true,
        default : 0
    },
},{
    timestamps : true
})

const Post = mongoose.models.Post || mongoose.model('Post',postSchema)

export default Post;