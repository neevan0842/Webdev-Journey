"use client";

import { useAuthStore } from "@/store/Auth";
import { AppwriteException } from "appwrite";
import React, { useState } from "react";

function Register() {
  const { createAccount, login } = useAuthStore();
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const firstname = formData.get("firstname") as string;
    const lastname = formData.get("lastname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!firstname || !lastname || !email || !password) {
      setError(() => "All fields are required");
      return;
    }

    setError("");
    setIsLoading(true);

    const response = await createAccount(
      `${firstname} ${lastname}`,
      email,
      password
    );

    if (response.error) {
      setError(() => response.error!.message);
    } else {
      const loginResponse = await login(email, password);
      if (loginResponse.error) {
        setError(() => loginResponse.error!.message);
      }
    }

    setIsLoading(false);
  };

  return (
    <div>
      <div className="">{error && <p>{error}</p>}</div>
      <div className="">
        <form onSubmit={handleSubmit}></form>
      </div>
    </div>
  );
}

export default Register;
