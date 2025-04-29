"use client";
import { useEffect } from "react";
import React from "react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import FollowersCard from "@/components/FollowersCard";

const Allies = () => {
  const { data: session } = useSession();
  const [allAllies, setAllAllies] = useState([]);
  const fetchFollowers = async () => {
    try {
      if (session && session.user && session.user.id) {
        const allFollowers = await fetch(
          `/api/followers?id=${session?.user?.id}`,
          {
            method: "GET",
          }
        );

        const fetchedFollowers = await allFollowers.json();
        console.log(fetchFollowers);
        setAllAllies(fetchedFollowers);
      }
    } catch (e) {
      console.log("Fetch Error : " + e.message);
    }
  };

  useEffect(() => {
    fetchFollowers();
  }, [session]);
  return (
    <div className="mt-[11vh] flex justify-center items-center w-full flex-col gap-5">
      <div className="title mt-[2vh] text-2xl font-bold rounded-md">
        <strong className="text-yellow-300 text-4xl text-shadow-md text-shadow-black">
          Allies
        </strong>
      </div>
      {allAllies.map((allies) => (
        <FollowersCard
          key={allies._id}
          firstName={allies.firstName}
          lastName={allies.lastName}
          image={allies.image}
        />
      ))}
    </div>
  );
};

export default Allies;
