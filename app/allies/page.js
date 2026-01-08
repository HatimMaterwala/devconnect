"use client";
import { useEffect } from "react";
import React from "react";
import { useState } from "react";
import FollowersCard from "@/components/FollowersCard";
import { useAuth } from "../context/AuthContext";

const Allies = () => {
  const { user } = useAuth();
  const [allAllies, setAllAllies] = useState([]);

  const fetchFollowing = async () => {
    if(!user) return; 
    try {
      if (user) {
        const allFollowing = await fetch(
          `/api/following?id=${user?.id}`,
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
    if(!user) return
      fetchFollowing();
  }, [user]);

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
