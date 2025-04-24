"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const PostCard = ({ title, description, image, author, timestamp }) => {
  const [profileToggle, setProfileToggle] = useState(false);
  const profileRef = useRef(null);
  const { data: session } = useSession();
  const Router = useRouter();

  const handleProfileToggle = () => {
    setProfileToggle((prev) => !prev);
  };

  const handleProfileClick = async () => {
    Router.push(`/user/${author._id}`);
    setProfileToggle(false);
  };

  const handleFollow = async (id) => {
    if (session) {
      const followUser = await fetch(
        `api/follow?from=${session.user.id}&to=${id}`,{
          method: "POST",
          headers : {
            "Content-Type" : "application/json"
          }
        }
      );

      if(followUser.ok){
        
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileToggle &&
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setProfileToggle(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileToggle]);

  return (
    <div className="w-full border border-black bg-black text-white rounded-md">
      <div className="authorDetails flex justify-start items-center gap-2 bg-yellow-300 p-2 text-black rounded-t-md relative">
        <Image
          src={author.image || "/profile.webp"}
          width={40}
          height={40}
          alt={`${author.firstName}`}
          className="rounded-full border-2 border-black cursor-pointer"
          priority
          onClick={handleProfileToggle}
        />

        {profileToggle && (
          <div
            ref={profileRef}
            className="bg-yellow-300 flex flex-col p-2 absolute top-12 left-8 rounded-2xl text-sm font-bold border w-[7rem]"
          >
            <button
              onClick={() => handleFollow(author._id)}
              className="p-1 border-b border-black hover:underline cursor-pointer bg-black text-white rounded-2xl"
            >
              Follow
            </button>
            <button
              onClick={handleProfileClick}
              className="p-1 border-black hover:underline cursor-pointer"
            >
              Profile
            </button>
          </div>
        )}

        <div className="name text-md font-bold font-mono">
          {" • " + author.firstName + " " + author.lastName}
        </div>

        <div className="timeStamp text-md font-bold font-mono">
          {" • " +
            new Date(timestamp).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
        </div>
      </div>

      {/* <div className="contentPart mt-1 flex flex-col gap-2 p-2">
        <div className="contentTitle font-bold">{title}</div>

        <div className="relative w-full h-[400px] rounded-md overflow-hidden">
          <Image
            src={image || "/profile.webp"}
            alt={`post_image`}
            className="object-contain"
            fill={true}
          />
        </div>

        <div className="caption text-sm">{description}</div>
      </div> */}

      <div className="flex flex-col gap-5 px-6 pt-4 pb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
          {title}
        </h2>

        {image && (
          <div className="relative w-full h-[420px] rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700 shadow-sm">
            <Image
              src={image}
              alt="Post Image"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 600px"
              priority
            />
          </div>
        )}

        <p className="text-base sm:text-lg text-neutral-300 leading-relaxed whitespace-pre-line font-medium">
          {description}
        </p>
      </div>

      <div className="flex postCounts gap-2 p-2 bg-yellow-300 rounded-b-md">
        <Image
          src={"/thumbs_up.png"}
          width={25}
          height={25}
          alt={`like_post`}
          className="rounded-full"
        />

        <Image
          src={"/comments.svg"}
          width={25}
          height={25}
          alt={`comment`}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default PostCard;
