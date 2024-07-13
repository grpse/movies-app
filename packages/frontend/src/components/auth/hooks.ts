"use client";
import { useApiCall } from "@/components/hooks";
import { useRouter } from "next/navigation";

export const useLogin = () => {
  const { callApi, data, error, loading } = useApiCall("/login", "POST");
  const router = useRouter();

  const onLogin = async (credentials: {
    username: string;
    password: string;
  }) => {
    await callApi(credentials);
    router.push("/");
  };

  return { onLogin, error, loading };
};

export const useSignup = () => {
  const { callApi, data, error, loading } = useApiCall("/signup", "POST");
  const router = useRouter();

  const onSignup = async (credentials: {
    username: string;
    password: string;
  }) => {
    await callApi(credentials);
    router.push("/auth/login");
  };

  return { onSignup, error, loading };
};
