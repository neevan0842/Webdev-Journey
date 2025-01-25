"use client";

import { useAuthStore } from "@/store/Auth";
import React, { useState } from "react";

function LoginPage() {
  const { login } = useAuthStore();
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError(() => "All fields are required");
      return;
    }

    setIsLoading(true);
    setError("");

    const response = await login(email, password);

    if (response.error) {
      setError(() => response.error!.message);
    }

    setIsLoading(false);
  };

  return <div>LoginPage</div>;
}

export default LoginPage;
