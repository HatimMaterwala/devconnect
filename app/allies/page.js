"use client";
import { useEffect } from "react";
import React from "react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import FollowersCard from "@/components/FollowersCard";

const Allies = () => {
  const { data: session, status } = useSession();
  const [allAllies, setAllAllies] = useState([]);

  const fetchFollowing = async () => {
    try {
      if (session && session.user && session.user.id) {
        const allFollowing = await fetch(
          `/api/following?id=${session?.user?.id}`,
          {
            method: "GET",
          }
        );

        const fetchedFollowing = await allFollowing.json();
        setAllAllies(fetchedFollowing);
      }
    } catch (e) {
      console.log("Fetch Error : " + e.message);
    }
  };

  useEffect(() => {
    if(status === "authenticated"){
      fetchFollowing();
    }
  }, [session]);

  return (
    <div className="mt-[4rem] flex justify-center items-center w-full flex-col gap-5 px-4">
      <div className="title mt-[2vh] text-2xl font-bold rounded-md">
        <strong className="text-yellow-300 text-4xl text-shadow-md text-shadow-black">
          Allies 
        </strong>
      </div>
      <div className="w-full flex gap-2 flex-wrap">
        {allAllies.map((allies) => (
          <FollowersCard
            key={allies._id}
            firstName={allies.firstName}
            lastName={allies.lastName}
            image={allies.image}
            id={allies._id}
            deleteAllies={(allyId)=>{
              setAllAllies((prev)=>
                prev.filter((ally)=>
                  ally._id !== allyId 
                )
              )
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Allies;
