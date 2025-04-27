import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Name is Required!"],
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      unique: [true, "Email Already Exists!"],
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
    },
    image: {
      type: String,
      required: false,
      default: "/profile.webp",
    },
    techStack: {
      type: Array,
      required: false,
    },
    bio: {
      type: String,
      required: false,
    },
    socials: {
      github: String,
      twitter: String,
    },
    resume: {
      type: String,
      required: false,
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default : []
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default : []
    },
    location: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: false,
      default: "User",
    },
    joined: {
        type : Date,
        required : true,
        default : Date.now
    }
  },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
