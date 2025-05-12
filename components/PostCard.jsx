"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFollow } from "@/app/context/FollowContext";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";
import CommentCard from "./CommentCard";

const PostCard = ({
  description,
  image,
  author,
  timestamp,
  id,
  likes,
  liked,
  onDelete,
  comments,
  onAddComment,
}) => {
  const [profileToggle, setProfileToggle] = useState(false);
  const [commentBox, setCommentBox] = useState(false);
  const [comment, setComment] = useState();

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

  const handleComment = async () => {
    if (!comment || comment.trim().length === 0) {
      return toast.error("Comment cannot be empty");
    }

    try {
      const postComment = await fetch(
        `/api/comment?userid=${session.user.id}&postid=${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment }),
        }
      );

      if (postComment.status === 200) {
        const newComment = {
          _id: crypto.randomUUID(), // you can remove this if backend returns _id
          id: {image : session.user.image,
            firstName : session.user.name.split(" ")[0],
            lastName : session.user.name.split(" ")[1]
          },
          wrote: comment,
          createdAt: new Date().toISOString(),
        };
        onAddComment?.(id, newComment);
        setComment("");
        toast.success("Thanks For Commenting !!");
      } else {
        toast.error("Comment Failed, Try Again !!!");
      }
    } catch (e) {
      toast.error("Server error while commenting");
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
      toast.success("🗑️ Post deleted!");
      setIsHiding(true);

      setTimeout(() => {
        onDelete?.();
      }, 300);
    } else {
      e.currentTarget.disabled = false;
      toast.success("Delte Failed, Try Again");
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

      <div className="flex flex-col postCounts bg-yellow-300 rounded-b-md">
        <div className="flex px-2 mt-1">
          <div
            onClick={handleThumbsUp}
            className="p-1 hover:bg-yellow-500 rounded-md cursor-pointer"
          >
            <Image
              src={`/${imageState}`}
              width={28}
              height={28}
              alt="like_post"
              className="rounded"
            />
          </div>

          <div
            onClick={() => {
              setCommentBox((prev) => !prev);
            }}
            className="p-1 hover:bg-yellow-500 rounded-md cursor-pointer"
          >
            <Image
              src={"/comments.svg"}
              width={28}
              height={28}
              alt="comment"
              className="rounded-full"
            />
          </div>
        </div>

        {likeCount > 0 && (
          <div className="likesCount text-black font-black px-5 pb-1">
            {likeCount}
          </div>
        )}

        {commentBox && (
          <div className="bg-black p-2 w-full mt-1 flex flex-col gap-1 ">
            <div className="flex gap-2 w-full">
              <div className="photo">
                <Image
                  src={session.user.image}
                  priority
                  width={40}
                  height={40}
                  alt="profile_image"
                  className="rounded-full"
                />
              </div>
              <div className="commentBox w-full bg-gray-700 h-[8rem] rounded-2xl">
                <label htmlFor="Comment Here"></label>
                <textarea
                  type="text"
                  placeholder="Comment Here"
                  className="w-full outline-none p-2 px-4 h-[8rem] rounded-2xl"
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                  required
                />
              </div>
            </div>

            <div className="buttons flex justify-end p-2 gap-2">
              <button
                onClick={() => setCommentBox(false)}
                className="bg-yellow-300 p-1 px-2 rounded-2xl text-black cursor-pointer font-bold hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleComment}
                className="bg-yellow-300 p-1 px-2 rounded-2xl text-black cursor-pointer font-bold hover:scale-105"
              >
                Comment
              </button>
            </div>
          </div>
        )}

        {commentBox && comments.length > 0 && (
          <div className="w-full p-2  bg-black">
            <div className="commentTitle font-bold text-xl px-1">Comments</div>

            <div className="max-h-[17rem] overflow-y-scroll scrollbar-thin mb-2 mt-2">
              {comments.map((oneComment) => {
                return (
                  <div key={oneComment._id} className="w-full p-2">
                    <CommentCard
                      userId={oneComment.id}
                      commentText={oneComment.wrote}
                      when={oneComment.createdAt}
                    />
                  </div>
                );
              })}
            </div>
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
  );
};

export default PostCard;
