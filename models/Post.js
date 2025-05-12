import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      type: Number,
      required: true,
      default: 0,
    },
    comments: {
      type: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId(), // 👈 generates unique ID per comment
          },
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // 👈 for population
            required: true,
          },
          wrote: {
            type: String,
            required: true,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      required: false,
    },
    commentCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
