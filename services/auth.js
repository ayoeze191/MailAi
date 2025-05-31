import axiosInstance from "@/axios/instance";
import axios from "axios";

export const authlogin = async (payload) => {
  return (await axiosInstance.post("/api/user/login", { ...payload })).data
    .data;
};

export const authgoogleLogin = async (tokenId) => {
  const req = (
    await axiosInstance.post("/api/user/continue/oauthsignin", {
      token: tokenId,
    })
  ).data;
  return req.data;
};
export const getUserService = async () => {
  const req = await axiosInstance.get("/api/user/me");
  return req.data.data;
};
