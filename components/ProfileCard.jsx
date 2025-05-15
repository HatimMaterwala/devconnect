"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";

const ProfileCard = ({userID}) => {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState(null);
  const [loader, setLoader] = useState(false);

  const fetchUser = async () => {
    setLoader(true);
    try {
      if (session) {
        const profileUser = await fetch(`/api/profile?id=${userID}`);
        const res = await profileUser.json();
        setProfileData(res);
        console.log(res);
      }
      setLoader(false);
    } catch (e) {
      console.log("Server Error : " + e);
    }
  };

  useEffect(() => {
    if(status === "authenticated"){
      fetchUser();
    }
  }, [status]);

  return (
    <div className="profile w-full flex justify-center items-center mt-[13vh]">
      {loader && <div className="loader m-auto"></div>}
      {profileData && (
        <div className="profileContainer w-[90%] border flex flex-col gap-5 bg-black text-white p-4 rounded-2xl">
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
      )}
    </div>
  );
};

export default ProfileCard;
