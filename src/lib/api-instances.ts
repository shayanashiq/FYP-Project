import { BASE_URL } from "@/common/constant/apis-urls";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { signOut } from "next-auth/react";

const instance = axios.create({
  // baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json; charset=utf-8",
  },
});

export const fetcher = (url: string, token?: string) => {
  if (token) {
    instance.interceptors.request.use(
      (config: AxiosRequestConfig): any => {
        config.headers = config.headers || {};
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
  }
  return instance
    .get(url)
    .then((response) => {
      return response.data.data;
    })
    .catch((error: AxiosError) => {
      const responseData = error.response?.data as any;
      console.log("this is the error ", error.response);

      if (
        error.response &&
        error.response.status === 401 &&
        responseData.message === "Token is expired"
      ) {
        signOut({
          callbackUrl: `${window.location.origin}/sign-in`,
        });
      }
      throw error;
    });
};

export const paginationFetcher = (url: string, token?: string) => {
  if (token) {
    instance.interceptors.request.use(
      (config: AxiosRequestConfig): any => {
        config.headers = config.headers || {};
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
  }
  return instance
    .get(url)
    .then((response) => {
      return response.data;
    })
    .catch((error: AxiosError) => {
      const responseData = error.response?.data as any;
      console.log("this is the error baksdjakd ", error.response);

      if (
        error.response &&
        error.response.status === 401 &&
        responseData.message === "Token is expired"
      ) {
        signOut({
          callbackUrl: `${window.location.origin}/sign-in`,
        });
      }
      throw error;
    });
};

export default instance;
