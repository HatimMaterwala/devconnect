"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const CreatePost = ({}) => {
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState();
  const [imageState, setImageState] = useState();

  const { data: session } = useSession();
  const Router = useRouter();

  const path = usePathname();
  console.log(path);

  const id = session?.user.id;

  useEffect(() => {
    if (image) {
      const tempUrl = URL.createObjectURL(image);
      setImageState(tempUrl);
      return () => URL.revokeObjectURL(tempUrl);
    }
  }, [image]);

  const submitPost = async () => {
    let imageUrl = null;
    try {
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "devconnect_upload");

        const uploadImage = await fetch(
          "https://api.cloudinary.com/v1_1/dhkgiep1w/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const res = await uploadImage.json();
        imageUrl = res.secure_url;
        console.log(imageUrl);
      }

      const createPost = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ desc, id, imageUrl }),
      });

      if (createPost.ok) {
        console.log("Posted Successful !!");
        Router.push("/");
      } else {
        console.log("Post status not ok !!");
      }
    } catch (e) {
      console.log("Fetch Request Failed : " + e);
    }
  };

  return (
    <div className="CreatePostForm w-full flex justify-center mt-[11vh]">
      <div className="CreateContainer w-[70%] bg-yellow-300 p-3 rounded-xl border-4 shadow-2xl shadow-black mt-[1rem] mb-[1.5rem]">
        <form action="" className="flex flex-col gap-3">
          <div className="flex justify-center items-center font-bold text-2xl text-white bg-black p-2 rounded-2xl">
            CREATE A POST
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="Content" className="font-bold text-xl">
              Content
            </label>
            <textarea
              type="text"
              required
              id="Content"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={`Your words can change someone's mindset!\nWanna Try ?`}
              className="h-[12rem] p-2 bg-black rounded-md text-white  outline-none"
            ></textarea>
          </div>

          <div className="gap-1 inline-block mt-[0.3rem]">
            <label className="cursor-pointer inline-block">
              <Image
                src="/upload.png"
                width={30}
                height={30}
                alt="upload_image"
                className="hover:scale-105 transition-transform"
              />

              <input
                type="file"
                id="uploadFile"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    console.log("Selected image:", file);
                    setImage(file);
                  }
                }}
              />
            </label>
          </div>

          {imageState && (
            <div className="selectedImage">
              <Image
                src={imageState}
                width={200}
                height={200}
                className="rounded-lg border"
                priority
                alt="selected_image"
              />
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.preventDefault();
                submitPost();
              }}
              className="bg-black font-bold hover:scale-105 transition-all text-white  cursor-pointer p-1 px-3 rounded-lg"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
