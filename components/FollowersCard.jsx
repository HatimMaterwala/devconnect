import React from "react";
import Image from "next/image";

const FollowersCard = ({ firstName, lastName, image }) => {
  return (
    <div className="w-1/3 border p-3 flex justify-start items-center gap-2 font-bold bg-yellow-300 text-black rounded-md">
      <div className="imageProfile">
        <Image
          src={image}
          width={40}
          height={40}
          alt="Profile_photo"
          priority
          className="rounded-full"
        />
      </div>

      <div className="Name">
        {firstName} {lastName}
      </div>
    </div>
  );
};

export default FollowersCard;
