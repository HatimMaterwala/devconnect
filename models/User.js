import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : [true, 'Name is Required!'],
    },
    lastName : {
        type : String,
        required : false
    },
    email : {
        type : String,
        required : [true, 'Email is required!'],
        unique : [true, 'Email Already Exists!']
    },
    password :{
        type : String,
        required : [true, 'Password is required!']
    },
    image : {
        type : String,
        required : false
    }

})

const User = mongoose.models.User || mongoose.model('User',userSchema);

export default User;