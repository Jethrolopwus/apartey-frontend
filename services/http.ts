import axios from "axios";
import endpoints from "./endpoints";
import {
  FormData,
  FormValues,
  ReviewFormData,
  RoleSubmissionData,
  RoleSubmissionResponse,
  UnlistedPropertyReview,
} from "@/types/generated";
import { TokenManager } from "@/utils/tokenManager";

const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
      // console.log("Login Data", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

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

  httpAddRoles = async (
    data: RoleSubmissionData
  ): Promise<RoleSubmissionResponse> => {
    try {
      const token = TokenManager.getToken();

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await AxiosInstance.patch(endpoints.addRoles, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        TokenManager.clearAllTokens();

        window.location.href = "/signin";
      }
      throw error;
    }
  };

  httpGetUsersProfile = async () => {
    try {
      const token = TokenManager.getToken();
      if (!token) throw new Error("No authentication token found.");

      const response = await AxiosInstance.get(endpoints.getUserProfile, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        TokenManager.clearAllTokens();
        window.location.href = "/signin";
      }
      throw error;
    }
  };
  httpGetProfileCompletionStat = async () => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found.");
      const response = await AxiosInstance.get(
        endpoints.getProfileCompletionStat,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        TokenManager.clearAllTokens();
        window.location.href = "/signin";
      }
      throw error;
    }
  };

  httpGetUsersRoles = async (): Promise<RoleSubmissionResponse> => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");
      console.log("Tonek", token);
      if (!token) throw new Error("No authentication token found.");

      const response = await AxiosInstance.get(endpoints.getUsersRole, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        TokenManager.clearAllTokens();
        window.location.href = "/signin";
      }
      throw error;
    }
  };

  httpWriteReview = async (id: string, data: ReviewFormData) => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await AxiosInstance.post(
        endpoints.writeReviews(id),
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");

        window.location.href = "/signin";
      }
      throw error;
    }
  };
  httpCreateListings = async (data: ReviewFormData) => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await AxiosInstance.post(endpoints.createListing, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");

        window.location.href = "/signin";
      }
      throw error;
    }
  };
  httpWriteUnlistedReview = async (data: UnlistedPropertyReview) => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      console.log(data);

      const response = await AxiosInstance.post(
        endpoints.writeUnlistedReview,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");

        window.location.href = "/signin";
      }
      throw error;
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

  httpGetAllReviews = async (
    limit?: number,
    sortBy?: string,
    sortOrder?: string
  ) => {
    try {
      let url = endpoints.getAllReviews;

      // Build query parameters
      const params = new URLSearchParams();
      if (sortBy) {
        params.append("sortBy", sortBy);
      }
      if (sortOrder) {
        params.append("sortOrder", sortOrder);
      }

      if (limit) {
        params.append("limit", limit.toString());
      }

      // Add parameters to URL if they exist
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await AxiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Search failed");
    }
  };
  httpGetReviewById = async (id: string) => {
    try {
      const response = await AxiosInstance.get(`/reviews/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("API error:", error);
      throw new Error(error.response?.data?.message || "Review not found");
    }
  };
  httpGeRelatedtReviews = async (id: string) => {
    try {
      const response = await AxiosInstance.get(`/reviews/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("API error:", error);
      throw new Error(error.response?.data?.message || "Review not found");
    }
  };
  httpGetAllListings = async (limit?: number, byId?: number) => {
    try {
      let url = endpoints.getAllListings;

      // Build query parameters
      const params = new URLSearchParams();
      if (byId) {
        params.append("byId", byId.toString());
      }
      if (limit) {
        params.append("limit", limit.toString());
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await AxiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Get all listings failed"
      );
    }
  };
  httpGetListingsById = async (id: string) => {
    try {
      const response = await AxiosInstance.get(`/listings/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Listing not found");
    }
  };

  httpGetRelatedListings = async (id: string) => {
    try {
      const response = await AxiosInstance.get(`/listings/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Listing not found");
    }
  };
}

const http = new BaseURL();
export default http;
