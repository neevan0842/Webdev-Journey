"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function VerifyEmail() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "verified" | "error"
  >("idle");
  const [token, setToken] = useState<string | null>(null);

  // Function to verify email
  const verifyEmail = async (token: string) => {
    try {
      setStatus("loading");
      await axios.post("/api/users/verifyemail", { token });
      setStatus("verified");
      toast.success("Email verified successfully!");
    } catch (error: any) {
      setStatus("error");
      toast.error(error.response?.data?.message || "Verification failed.");
    }
  };

  // Extract token from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    setToken(urlToken);

    if (urlToken) {
      verifyEmail(urlToken);
    } else {
      setStatus("error");
      toast.error("Invalid or missing token.");
    }
  }, []);

  // UI Rendering
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Verify Email</h1>

        {status === "loading" && (
          <p className="text-center text-gray-600">Verifying your email...</p>
        )}

        {status === "verified" && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              Email verified successfully!
            </h2>
            <Link
              href="/login"
              className="text-blue-600 hover:underline text-lg"
            >
              Click here to log in
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-red-600 mb-4">
              Verification failed.
            </h2>
            <p className="text-gray-600 mb-4">
              Please check your token or try signing up again.
            </p>
            <Link
              href="/signup"
              className="text-blue-600 hover:underline text-lg"
            >
              Go to Signup
            </Link>
          </div>
        )}

        {status === "idle" && (
          <p className="text-center text-gray-600">
            Awaiting verification process...
          </p>
        )}
      </div>
    </div>
  );
}
