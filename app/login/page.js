"use client";
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const { setUser, fetchUser } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: pass }),
      });

      if (res.ok) {
        const { user } = await res.json();
        setUser(user);
        toast.success("Login Successful!");
        setEmail("");
        setPass("");
        router.push("/");
      } else {
        toast.error("Invalid Credentials!");
      }
    } catch (err) {
      toast.error("Something went wrong, please try again later !!");
    }
  };

  return (
    <div className="fullBody w-full h-[89vh] flex flex-col gap-4 justify-center items-center mt-[11vh]">
      <h1 className="text-2xl font-bold text-center">
        <strong className="text-yellow-400">LOGIN </strong>to DevConnect
      </h1>

      <div className="box bg-black w-1/3 p-6 rounded-lg text-white font-bold">
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
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
          >
            Login
          </button>
        </form>
      </div>

      <hr className="w-1/3 mt-4 border border-yellow-400" />

      <div className="googlesignIn mt-2 w-1/3 flex justify-center items-center gap-2">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              const res = await fetch("/api/auth/google", {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  token: credentialResponse.credential,
                }),
              });

              if (!res.ok) {
                toast.error("Google login failed");
                return;
              }

              await fetchUser(); // hydrate from /auth/me
              toast.success("Logged in with Google");
              router.push("/");
            } catch (err) {
              toast.error("Something went wrong with Google login");
            }
          }}
          onError={() => {
            toast.error("Google login failed");
          }}
        />
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
