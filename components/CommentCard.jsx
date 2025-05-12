import React from "react";
import Image from "next/image";

const CommentCard = ({ userId, commentText, when }) => {
  return (
    <div className="w-full flex flex-col bg-yellow-300 text-black rounded-lg p-2 gap-1">
      <div className="userDetails flex gap-2 justify-between items-center">
        <div className="flex justify-center items-center gap-2">
          <div className="image">
            <Image
              src={userId.image}
              width={35}
              height={35}
              priority
              alt="profile_photo"
              className="rounded-full"
            />
          </div>
          <div className="profile font-black text-md">{`${userId.firstName} ${userId.lastName}`} </div>
        </div>

        <div className="whenPosted font-bold">
          {new Date(when).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>

      <div className="comment whitespace-pre-line px-2 p-1">{commentText}</div>
    </div>
  );
};

export default CommentCard;
