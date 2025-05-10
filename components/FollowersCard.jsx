import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FollowersCard = ({ firstName, lastName, image, id }) => {
  const Router = useRouter();

  const handleFollowers = async () => {
    Router.push(`/user/${id}`);
  }

  return (
    <div onClick={handleFollowers} className="w-[30%] border p-3 flex justify-start items-center gap-2 font-bold bg-yellow-300 text-black rounded-md cursor-pointer">
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
