"use client";
import { useApiCall } from "@/components/hooks";

export const useLogin = () => {
  const { callApi, data, error, loading } = useApiCall("/auth/login", "POST");

  const onLogin = async (credentials: {
    username: string;
    password: string;
  }) => {
    await callApi(credentials);
  };

  return { onLogin, error, loading };
};

export const useSignup = () => {
  const { callApi, data, error, loading } = useApiCall("/auth/signup", "POST");

  const onSignup = async (credentials: {
    username: string;
    password: string;
  }) => {
    await callApi(credentials);
  };

  return { onSignup, error, loading };
};
