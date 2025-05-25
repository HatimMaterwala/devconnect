"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const FollowersCard = ({ firstName, lastName, image, id, deleteAllies }) => {
  const Router = useRouter();
  const { data: session } = useSession();
  const user = session.user.id;
  const handleFollowers = async () => {
    Router.push(`/user/${id}`);
  };

  const handleRemove = async (e) => {
    e.preventDefault();

    try {
      const deleteFollower = await fetch(
        `/api/following?userid=${user}&deleteid=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (deleteFollower.status === 200) {
        toast.success(`You no longer follow ${firstName}`);
        console.log("Removed Successfully");
        deleteAllies(id);
      }
    } catch (e) {
      console.log("Failed Delete");
      toast.error("cannot remove right now, try again later!!");
    }
  };

  return (
    <div className="w-[25rem] border p-3 flex justify-between items-center gap-2 font-bold bg-yellow-300 text-black rounded-md">
      <div className="flex justify-center items-center gap-2">
        <div onClick={handleFollowers} className="imageProfile cursor-pointer">
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

      <div
        onClick={(e) => {
          handleRemove(e);
        }}
        className="remove bg-black text-white p-1 px-2 rounded-2xl flex justify-center items-center hover:scale-95 cursor-pointer"
      >
        Unfollow
      </div>
    </div>
  );
};

export default FollowersCard;
