"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { signIn, getProviders, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [, setProviders] = useState([]);

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
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password: pass,
      });

      if (res?.ok) {
        toast.success("Login Successful!");
        setEmail("");
        setPass("");
      } else {
        toast.error("Invalid Credentials!");
      }
    } catch (err) {
      console.log("Login Error:", err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="fullBody w-full h-[89vh] flex flex-col gap-4 justify-center items-center mt-[11vh]">
      <h1 className="text-2xl font-bold text-center">
        <strong className="text-yellow-400">LOGIN </strong>to DevConnect
      </h1>

      <div className="box bg-black w-1/3 p-6 rounded-lg text-white font-bold">
        <form className="flex w-full flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <div className="email flex flex-col">
            <label htmlFor="email">E-mail</label>
            <input
              type="text"
              placeholder="Enter your email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-yellow-400 text-black p-2 rounded-lg w-full"
              required
            />
          </div>

          <div className="password flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="bg-yellow-400 text-black p-2 rounded-lg w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black p-2 rounded-lg font-bold hover:bg-yellow-300 transition"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>
      </div>

      <hr className="w-1/3 mt-4 border border-yellow-400" />

      <div className="googlesignIn mt-2 w-1/3 flex justify-center items-center gap-2">
        <button
          className="cursor-pointer bg-yellow-400 p-2 rounded-lg hover:bg-yellow-300 transition"
          onClick={async () => {
            await signIn("google");
          }}
        >
          <Image
            src={"/google.png"}
            width={30}
            height={30}
            alt={"google_image"}
            className="shadow-sm shadow-amber-700 rounded-full"
          />
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
