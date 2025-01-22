"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SignUp() {
  const router = useRouter();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
  });

  const signUp = async () => {
    try {
      const response = await axios.post("/api/users/signup", user);
      router.push("/login");
      toast.success("User created successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.username.length > 0 &&
      user.password.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="font-bold text-3xl mb-2">Signup</h1>
      <hr />
      <label className="text-lg mb-2" htmlFor="username">
        Username
      </label>
      <input
        type="text"
        name="username"
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        value={user.username}
        placeholder="username"
        className="border outline-none rounded-md p-2 mb-4"
      />
      <label className="text-lg mb-2" htmlFor="email">
        Email
      </label>
      <input
        type="text"
        name="email"
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        value={user.email}
        placeholder="email"
        className="border outline-none rounded-md p-2 mb-4"
      />
      <label className="text-lg mb-2" htmlFor="password">
        Password
      </label>
      <input
        type="text"
        name="password"
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        value={user.password}
        placeholder="password"
        className="border outline-none rounded-md p-2 mb-4"
      />
      <button
        className={`${
          buttonDisabled && "opacity-50"
        } bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md`}
        onClick={signUp}
        disabled={buttonDisabled}
      >
        Signup
      </button>
      <Link href={"/login"}>Already have an account?</Link>
    </div>
  );
}
