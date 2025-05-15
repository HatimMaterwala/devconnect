"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import PostCard from "@/components/PostCard";

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState();
  const [loader, setLoader] = useState(false);

  const fetchUser = async () => {
    setLoader(true);
    try {
      if (session) {
        const profileUser = await fetch(`/api/profile?id=${session.user.id}`);
        const res = await profileUser.json();
        console.log(res);
        setProfileData(res);
      }
      setLoader(false);
    } catch (e) {
      console.log("Server Error : " + e);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchUser();
    }
  }, [status]);

  return (
    <div className="profile w-full flex justify-center items-center mt-[4rem]">
      {loader && <div className="loader m-auto"></div>}
      {profileData && (
        <div className="w-[90%] border flex flex-col gap-5 text-white p-4 rounded-2xl">
          <div className="profileContainer w-full h-full flex flex-col gap-5 bg-black p-4 rounded-2xl">
            <div className="profile_photo flex justify-center">
              <Image
                src={profileData.image || "/github.png"}
                alt="profile_photo"
                width={100}
                height={100}
                priority
                className="rounded-full shadow-2xl shadow-yellow-200 border-yellow-300 border-4"
              />
            </div>
            <div className="name">
              <strong>
                <span className="bg-yellow-300 p-1 px-2 rounded-md text-black">
                  Name
                </span>

                <span className="font-mono">
                  {" "}
                  {profileData.firstName} {profileData.lastName}
                </span>
              </strong>
            </div>

            <div className="email">
              <strong>
                <span className="bg-yellow-300 p-1 px-2 rounded-md text-black">
                  Email
                </span>
                <span className="font-mono"> {profileData.email}</span>
              </strong>
            </div>

            <div className="Joined">
              <strong>
                <span className="bg-yellow-300 p-1 px-2 rounded-md text-black">
                  Joined
                </span>
                <span className="font-mono">
                  {" "}
                  {new Date(profileData.joined).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </strong>
            </div>
          </div>
          {profileData.userPosts.length > 0 && (
            <div className="w-full border border-black rounded-2xl bg-black p-2 px-4">
              <div>
                <p className="p-1 text-2xl font-bold">Posts</p>
              </div>
              <div className="flex gap-3 justify-start flex-nowrap overflow-x-scroll mt-2 hide-scrollbar">
                {profileData.userPosts.map((post, index) => {
                  return (
                    <div key={post._id} className="w-[21.82rem]">
                      <PostCard
                        description={post.description}
                        image={post.image || null}
                        author={post.author}
                        timestamp={profileData.allDate[index]}
                        id={post._id}
                        likes={post.likes}
                        liked={profileData.likedPosts}
                        onDelete={() => {
                          setProfileData((prev) => {
                            return {
                              ...prev,
                              userPosts: prev.userPosts.filter(
                                (p) => p._id !== post._id
                              ),
                            };
                          });
                        }}
                        comments={post.comments}
                        onAddComment={(postId, newComment) => {
                          setProfileData((prev) =>
                            prev.userPosts.map((post) =>
                              post._id === postId
                                ? {
                                    ...post,
                                    comments: [...post.comments, newComment],
                                  }
                                : post
                            )
                          );
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center mt-2">--- 👉 ---</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
