"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { signIn, getProviders, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

const SignUp = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const { data: session } = useSession();

  const [providers, setProviders] = useState([]);
  useEffect(() => {
    const getProvidersList = async () => {
      const providersList = await getProviders();
      setProviders(providersList);
    };
    getProvidersList();
  }, []);

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session]);

  const handleLogin = async () => {
    try {
      const userData = await fetch("/api/signup-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password: pass,
        }),
      });

      if (userData.ok) {
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password: pass,
        });

        if (res?.ok) {
          const notify = () => toast("Wow so easy!");
          notify();
        } else {
          console.log("Auto-Login Failed");
        }

        setEmail("");
        setPass("");
        setFirstName("");
        setLastName("");
      } else {
        const errMsg = await userData.text();
        console.log("Sign-Up Failed : " + errMsg);
      }
    } catch (e) {
      console.log("Error Sending Request!!");
    }
  };

  return (
    <div className="fullBody w-full h-[89vh] flex flex-col gap-2 justify-center items-center mt-[11vh]">
      <h1 className="text-2xl font-bold">
        <strong className="text-red-600"> JOIN </strong>the Best Dev&apos;s Community
      </h1>
      <div className="box bg-black w-1/3 p-6 rounded-lg text-white font-bold">
        <form action="submit" className="flex w-full flex-col gap-2">
          <div className="Name flex justify-between items-center gap-2">
            <div className="firstName flex flex-col">
              <label htmlFor="fName">First Name</label>
              <input
                type="text"
                placeholder="First Name"
                name="fName"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                className="bg-yellow-300 text-black p-2 rounded-lg w-full"
                required
              />
            </div>

            <div className="lastName flex flex-col">
              <label htmlFor="LName">Last Name</label>
              <input
                type="text"
                placeholder="Last Name"
                name="LName"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                className="bg-yellow-300 text-black p-2 rounded-lg w-full"
              />
            </div>
          </div>

          <div className="email flex flex-col">
            <label htmlFor="email">E-mail</label>
            <input
              type="text"
              placeholder="Enter your email"
              name="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="bg-yellow-300 text-black p-2 rounded-lg w-full"
            />
          </div>

          <div className="password flex flex-col">
            <label htmlFor="email">Password</label>
            <input
              type="password"
              placeholder="password"
              name="password"
              value={pass}
              onChange={(e) => {
                setPass(e.target.value);
              }}
              required
              className="bg-yellow-300 text-black p-2 rounded-lg w-full"
            />
          </div>
        </form>
      </div>
      <div className="buttonforsignUp mt-2 w-1/3" onClick={handleLogin}>
        <button className="w-full bg-black p-2 rounded-lg cursor-pointer    ">
          <strong className="text-white ">Sign Up</strong>
        </button>
      </div>

      <hr className="w-1/3 mt-4 border border-black" />

      <div className="googlesignUp mt-2 w-1/3 flex justify-center items-center gap-2">
        <button
          className="cursor-pointer bg-yellow-300 p-2 rounded-lg"
          onClick={async () => {
            await signIn("google");
          }}
        >
          <Image
            src={'/google.png'}
            width={30}
            height={30}
            alt={'google_image'}
            className="shadow-sm shadow-amber-700 rounded-full"
          />
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
