"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFollow } from "@/app/context/FollowContext";
import { usePathname } from "next/navigation";

const PostCard = ({
  description,
  image,
  author,
  timestamp,
  id,
  likes,
  liked,
  onDelete
}) => {
  const [profileToggle, setProfileToggle] = useState(false);

  const [isHiding, setIsHiding] = useState(false);

  const profileRef = useRef(null);
  const followRef = useRef();
  const { data: session } = useSession();
  const Router = useRouter();
  const pathname = usePathname();

  const { following, toggleFollow } = useFollow();
  const isFollowing =
    following[author._id] ?? author?.followers?.includes(session?.user?.id);

  // ✅ Like state
  const [isLiked, setIsLiked] = useState(false);
  const [imageState, setImageState] = useState("like.svg");
  const [likeCount, setLikeCount] = useState(likes);

  // ✅ Expand state
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (liked?.includes(id)) {
      setIsLiked(true);
      setImageState("unlike.svg");
    } else {
      setIsLiked(false);
      setImageState("like.svg");
    }
  }, [liked, id]);

  const handleProfileToggle = () => {
    setProfileToggle((prev) => !prev);
  };

  const handleProfileClick = () => {
    Router.push(`/user/${author._id}`);
    setProfileToggle(false);
  };

  const handleMessageClick = () => {
    // coming soon
  };

  const handleFollow = async (id) => {
    if (!session) return;
    followRef.current.disabled = true;

    const prevState = isFollowing;
    toggleFollow(id);

    try {
      const res = await fetch(
        `/api/follow?from=${session.user.id}&to=${id}&request=${prevState ? "Unfollow" : "Follow"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        toggleFollow(id); // revert
        console.error("Follow/unfollow failed");
      }
    } catch (err) {
      toggleFollow(id);
      console.error(err);
    }

    followRef.current.disabled = false;
  };

  const handleThumbsUp = async () => {
    if (!session) return;

    try {
      const likePost = await fetch(
        `/api/like?id=${id}&user=${session?.user?.id}&request=${isLiked ? "unlike.svg" : "like.svg"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (likePost.ok) {
        setIsLiked(!isLiked);
        setImageState(isLiked ? "like.svg" : "unlike.svg");
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
        console.log("Like Success");
      } else {
        console.log("Like failed");
      }
    } catch (e) {
      console.error("Like error:", e);
    }
  };

  const editPost = async () => {};

  const deletePost = async (e) => {
    e.currentTarget.disabled = true;

    const thisPost = await fetch(`/api/post?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (thisPost.ok) {
      console.log("Post Deleted Successfully");
      setIsHiding(true);

      setTimeout(() => {
        onDelete?.();
      }, 300);
    } else {
      console.log("Delete Failed");
      e.currentTarget.disabled = false;
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
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileToggle]);

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  return (
    (
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isHiding ? "opacity-0 scale-95 max-h-0 p-0 mb-0" : "max-h-[1000px]"
        } ${
          pathname === "/profile"
            ? "w-[21.82rem] shadow-lg shadow-yellow-300"
            : "w-[35rem]"
        } bg-black border border-black text-white rounded-md flex flex-col justify-between`}
      >
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
              className="bg-yellow-300 flex flex-col p-2 absolute top-12 left-8 rounded-2xl text-sm font-bold border w-[7rem] z-50"
            >
              {session?.user?.id !== author._id && (
                <>
                  <button
                    onClick={() => handleFollow(author._id)}
                    ref={followRef}
                    className="p-1 border-b border-black hover:underline cursor-pointer bg-black text-white rounded-2xl"
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                  <button
                    onClick={handleMessageClick}
                    className="p-1 border-black hover:underline cursor-pointer"
                  >
                    Message
                  </button>
                </>
              )}
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

        <div className="flex flex-col">
          {image && (
            <div className="relative w-full h-[300px] bg-neutral-800shadow-sm overflow-hidden">
              <Image
                src={image}
                alt="Post Image"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="p-2 px-4">
            <p
              className={`text-base sm:text-lg text-neutral-300 leading-relaxed font-medium whitespace-pre-line transition-all ${
                isExpanded ? "max-h-full" : "max-h-[3rem] overflow-hidden"
              }`}
            >
              {description}
            </p>
            {description?.length > 100 && (
              <button
                onClick={toggleExpand}
                className="text-blue-500 mt-1 hover:underline text-sm cursor-pointer"
              >
                {isExpanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col postCounts p-2 bg-yellow-300 rounded-b-md ">
          <div className="flex">
            <div
              onClick={handleThumbsUp}
              className="p-1 hover:bg-yellow-500 rounded-md cursor-pointer"
            >
              <Image
                src={`/${imageState}`}
                width={25}
                height={25}
                alt="like_post"
                className="rounded"
              />
            </div>

            <div className="p-1 hover:bg-yellow-500 rounded-md">
              <Image
                src={"/comments.svg"}
                width={25}
                height={25}
                alt="comment"
                className="rounded-full cursor-pointer"
              />
            </div>
          </div>

          {likeCount > 0 && (
            <div className="likesCount text-black font-black px-3">
              {likeCount}
            </div>
          )}

          {pathname === "/profile" && (
            <div className="flex justify-end items-center p-1 gap-2">
              <button
                className="bg-black p-2 rounded-md cursor-pointer hover:scale-110 transition-all duration-200 ease-out"
                onClick={(e) => editPost(e)}
              >
                Edit
              </button>
              <button
                className="bg-black p-2 rounded-md cursor-pointer hover:scale-110 transition-all duration-200 ease-out"
                onClick={(e) => deletePost(e)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default PostCard;
