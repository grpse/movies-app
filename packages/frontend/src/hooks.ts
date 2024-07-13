"use client";

import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import * as axiosCookieJarSupport from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

const jar = new CookieJar();

export const useAxiosWithCredentials = () => {
  const [cookies] = useCookies(["jwt-token"]);
  const axiosInstance = axiosCookieJarSupport.wrapper(
    axios.create({
      baseURL: "/",
      withCredentials: true,
      headers: {
        Cookie: `jwt-token=${cookies["jwt-token"]}`,
      },
      jar,
    })
  );

  return axiosInstance;
};

export const useApiCall = <T = unknown>(
  endpoint: string,
  method: string = "GET"
) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const axiosInstance = useAxiosWithCredentials();

  const callApi = async <TBody>(
    data: TBody,
    endpointComplement = ""
  ): Promise<{ data: T | null; error: string | null }> => {
    setLoading(true);
    try {
      const response = await axiosInstance<T>({
        method,
        url: `/api${endpoint}${endpointComplement}`,
        data,
      });
      setData(response.data);
      return {
        data: response.data,
        error: null,
      };
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return {
        data: null,
        error: err.message || "An error occurred",
      };
    } finally {
      setLoading(false);
    }
  };

  return { callApi, data, error, loading };
};

export const useLoggedSession = () => {
  const router = useRouter();
  const [cookies, , removeCookie] = useCookies();
  const jwtToken = cookies["jwt-token"] as string | undefined;

  const logout = () => {
    removeCookie("jwt-token", { path: "/" });
    router.push("/");
  };

  return {
    isLoggedIn: !!jwtToken,
    logout,
  };
};
