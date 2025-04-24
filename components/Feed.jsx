"use client";
import { useEffect, useState } from "react";
import PostCard from "./PostCard";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const fetchData = async () => {
    const allPosts = await fetch("/api/post", {
      method: "GET",
    });
    const resPosts = await allPosts.json();

    if (resPosts) {
      setPosts(resPosts);
      console.log(resPosts);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-[35%] flex flex-col items-center mt-[11vh]">
      {posts.map((post) => {
        return (
          <div key={post._id} className="w-full mt-2 mb-2">
            <PostCard
              title={post.title}
              description={post.description}
              image={post.image || null}
              author={post.author}
              timestamp={post.timestamp}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Feed;
