"use client";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

const Navbar = () => {
  const { data: session } = useSession();
  const [profileMenu, setProfileMenu] = useState(true);

  const handleToggle = () => {
    setProfileMenu((prev) => {
      return !prev;
    })
  }
  return (
    <nav className="bg-black w-full h-[11vh] flex justify-between items-center p-3">
      <div className="navLogo">
        <Link href="/" className="text-2xl font-bold text-yellow-300">
          DevConnect
        </Link>
      </div>

      {session ? (
        <div className="otherFields flex justify-center items-center gap-7">
          <Link href={"/"} className="cursor-pointer text-yellow-300">
            <span className="material-symbols-outlined scale-110">home</span>
          </Link>
          <Link href={"/mynetwork"} className="cursor-pointer text-yellow-300">
            <span className="material-symbols-outlined scale-150">groups</span>
            {/* <strong>My Network</strong> */}
          </Link>
          <Link className="cursor-pointer" href={"/post"}>
            <button className="cursor-pointer bg-yellow-300 p-1 px-2 rounded-full text-black">
              <strong>Create Post</strong>
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="credentials flex gap-2">
            <Link className="cursor-pointer" href={"/signUp"}>
              <button className="cursor-pointer bg-yellow-300 p-1 px-3 rounded-full text-black">
                <strong>Sign Up</strong>
              </button>
            </Link>

            <Link className="cursor-pointer" href={"/logIn"}>
              <button className="cursor-pointer bg-yellow-300 p-1 px-3 rounded-full text-black">
                <strong>Log In</strong>
              </button>
            </Link>
          </div>
        </>
      )}

      {session && (
        <div className="relative">
          <Image
            src={session.user.image || "/profile.webp"}
            width={40}
            height={40}
            alt="profile_image"
            className="rounded-full cursor-pointer border-2  border-yellow-300"
            onClick={handleToggle}
          />
          {profileMenu && 
            <div className="bg-yellow-300 flex flex-col p-2 w-[8vw] absolute right-6 rounded-b-2xl rounded-l-2xl text-sm font-bold border">
              <Link href={'/profile'} className="p-1 border-b-1">Profile</Link>
              <Link href={'/profile'} className="p-1 border-b-1">Settings & Privacy</Link>
              <div onClick={()=> signOut()} className="p-1 cursor-pointer hover:underline-offset-auto">Log Out</div>
            </div>
          }
        </div>
      )}
    </nav>
  );
};

export default Navbar;
