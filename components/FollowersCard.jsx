import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FollowersCard = ({ firstName, lastName, image, id }) => {
  const Router = useRouter();

  const handleFollowers = async () => {
    Router.push(`/user/${id}`);
  };

  const handleRemove = async () => {
    
  }

  return (
    <div

      className="w-[25rem] border p-3 flex justify-between items-center gap-2 font-bold bg-yellow-300 text-black rounded-md"
    >
      <div className="flex justify-center items-center gap-2">
        <div       onClick={handleFollowers} className="imageProfile cursor-pointer">
          <Image
            src={image}
            width={40}
            height={40}
            alt="Profile_photo"
            priority
            className="rounded-full hover:border"
          />
        </div>

        <div className="Name">
          {firstName} {lastName}
        </div>
      </div>

      <div onClick={handleRemove} className="remove bg-black text-white p-1 px-2 rounded-2xl flex justify-center items-center hover:scale-95 cursor-pointer">
        Remove
      </div>
    </div>
  );
};

export default FollowersCard;
