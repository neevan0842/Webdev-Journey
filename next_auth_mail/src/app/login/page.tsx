"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const login = async () => {
    try {
      const response = await axios.post("/api/users/login", user);
      toast.success("Login successful");
      router.push(`/profile`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="font-bold text-3xl mb-2">Login</h1>
      <hr />
      <form className="flex flex-col" onSubmit={handleLogin}>
        <label className="text-lg mb-2" htmlFor="email">
          Email
        </label>
        <input
          type="text"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          name="email"
          placeholder="email"
          className="border outline-none rounded-md p-2 mb-4"
        />
        <label className="text-lg mb-2" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          name="password"
          placeholder="password"
          className="border outline-none rounded-md p-2 mb-4"
        />
        <button
          className="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md"
          type="submit"
        >
          Login
        </button>
      </form>
      <Link className="mt-4" href="/signup">
        Doesn't have account? Sign up
      </Link>
    </div>
  );
}
