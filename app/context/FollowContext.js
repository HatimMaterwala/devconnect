"use client";
import { createContext, useContext, useState } from "react";

const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
  const [following, setFollowing] = useState({}); // { userId: true/false }

  const toggleFollow = (userId) => {
    setFollowing((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const setUserFollowState = (userId, state) => {
    setFollowing((prev) => ({
      ...prev,
      [userId]: state,
    }));
  };

  return (
    <FollowContext.Provider value={{ following, toggleFollow, setUserFollowState }}>
      {children}
    </FollowContext.Provider>
  );
};

export const useFollow = () => useContext(FollowContext);
