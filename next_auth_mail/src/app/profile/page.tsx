"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Profile = () => {
  const router = useRouter();
  const [data, setData] = useState<{
    email: string;
    username: string;
    _id: string;
    isVerified: boolean;
  } | null>(null);

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get("/api/users/me");

      const user = response.data.data;
      setData(user);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Profile Page</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
        <div className="flex flex-col items-center">
          <img
            src="https://avatars.githubusercontent.com/u/43129350?v=4"
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4"
          />
          <h2 className="text-2xl font-semibold mb-2">{`${data?.username} (${
            data?.isVerified ? "Verified" : "Not Verified"
          })`}</h2>
          <p className="text-gray-400">{data?.email}</p>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">About</h3>
          <p className="text-gray-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
            odio. Praesent libero. Sed cursus ante dapibus diam.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mt-4"
        >
          Logout
        </button>
        <button
          onClick={() => router.push(`/profile/${data?._id}`)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mt-4"
        >
          Visit Profile
        </button>
      </div>
    </div>
  );
};
export default Profile;
