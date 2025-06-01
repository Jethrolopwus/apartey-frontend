import axios from "axios";
import endpoints from "./endpoints";
import { FormData, FormValues } from "@/types/generated";




const AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    // timeout: 10000,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  AxiosInstance.interceptors.request.use(
    (config) => {
      // Get token from localStorage if it exists
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  class BaseURL {
    httpSignUp = async (data: FormData) => {
      try {
        const response = await AxiosInstance.post(endpoints.signup, data);
        return response.data; 
      } catch (error: any) {
        throw new Error(error.response?.data?.message || "Signup failed");
      }
    };

  httpSignIn = async (data: FormData) => {
    try {
        const response = await AxiosInstance.post(endpoints.signin, data);
        return response.data;
      } catch (error) {
        throw error;
      }
  }
  httpVerifyEmail = async (data: FormValues) => {
    try {
      const response = await AxiosInstance.post(endpoints.verifyEmail, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Verification failed");
    }
  };
  httpResendCode = async (data: FormValues) => {
    try {
      const response = await AxiosInstance.post(endpoints.resendCode, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "ResendCode failed");
    }
  };
  httpResetPassword = async (data: FormValues) => {
    try {
      const response = await AxiosInstance.post(endpoints.resetPassword, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "ResetPassword failed");
    }
  };

 


     httpSearchReviews = async (searchTerm: string) => {
      try {
        const response = await AxiosInstance.get("/reviews/search", {
          params: { fullAddress: searchTerm },
        });
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || "Search failed");
      }
    };
  
  httpGetAllReviews = async () =>{
    try {
      
      const response = await AxiosInstance.get(endpoints.getAllReviews) 
      return response.data;
    } catch (error:any) {
      throw new Error(error.response?.data?.message || "Search failed");
    }
  }

}
const http = new BaseURL();
export default http;