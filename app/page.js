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
      const { posts, liked } = resPosts;
      setGetPosts(posts);
      setLikedP(liked);
    }
  };

  if (!session) {
    return (
      <>
        <div className="bg-black text-yellow-400 pt-24 min-h-screen flex flex-col">
          {/* Hero Section */}
          <section className="flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-6xl font-extrabold mb-4 tracking-tight">
              DevConnect
            </h1>
            <p className="text-yellow-300 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
              A social platform for developers. Share projects, follow peers,
              comment, and grow your network.
            </p>
            <div className="flex space-x-4">
              <a
                href="/signup"
                className="bg-yellow-400 text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-yellow-300 transition"
              >
                Get Started
              </a>
              <a
                href="/logIn"
                className="border-2 border-yellow-400 px-8 py-3 rounded-full text-lg font-semibold hover:bg-yellow-400 hover:text-black transition"
              >
                Login
              </a>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl shadow-lg hover:scale-105 transform transition">
                <h3 className="text-2xl font-bold mb-3">Share Your Work</h3>
                <p className="text-yellow-300">
                  Post your projects and updates to showcase your skills and get
                  feedback from the community.
                </p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl shadow-lg hover:scale-105 transform transition">
                <h3 className="text-2xl font-bold mb-3">Follow & Connect</h3>
                <p className="text-yellow-300">
                  Follow other developers, discover inspiring projects, and grow
                  your network in the tech world.
                </p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl shadow-lg hover:scale-105 transform transition">
                <h3 className="text-2xl font-bold mb-3">
                  Comment & Collaborate
                </h3>
                <p className="text-yellow-300">
                  Engage with posts, provide valuable feedback, and find
                  collaborators for your next big project.
                </p>
              </div>
            </div>
          </section>

          <section className="py-20 bg-yellow-400 text-black text-center rounded-t-3xl">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4">
              Join DevConnect Today
            </h2>
            <p className="mb-8 text-lg sm:text-xl max-w-xl mx-auto">
              Sign up now and start sharing your projects with the developer
              community.
            </p>
            <a
              href="/signUp"
              className="bg-black text-yellow-400 px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-900 transition"
            >
              Get Started
            </a>
          </section>

          <footer className="bg-black py-6 text-center text-yellow-400">
            &copy; 2025 DevConnect. All rights reserved.
          </footer>
        </div>
      </>
    );
  }

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status, session?.user?.id]);

  return (
    <div className="w-full flex justify-center items-center mt-[5rem]">
      <Feed
        feedPosts={getPosts}
        likedPosts={likedP}
        onAddComment={(postId, newComment) => {
          setGetPosts((prev) =>
            prev.map((post) =>
              post._id === postId
                ? { ...post, comments: [...post.comments, newComment] }
                : post
            )
          );
        }}
      />
    </div>
  );
}
