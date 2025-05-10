"use client";
import Feed from "@/components/Feed";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  const [getPosts, setGetPosts] = useState([]);
  const [likedP, setLikedP] = useState([]);

  const fetchData = async () => {
    const allPosts = await fetch(`/api/post?id=${session?.user?.id}`, {
      method: "GET",
    });

    const resPosts = await allPosts.json();

    if (resPosts) {
      const {posts , liked} = resPosts;
      setGetPosts(posts);
      setLikedP(liked);
    }
  };

  useEffect(() => {
    if(status === "authenticated"){
      fetchData();
    }
  }, [status, session?.user?.id]);

  return (
    <div className="w-full flex justify-center items-center mt-[5rem]">
      <Feed feedPosts={getPosts} likedPosts={likedP} />
    </div>
  );
}
