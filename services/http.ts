import axios from "axios";
import endpoints from "./endpoints";
import type {
  FormData,
  FormValues,
  OnboardingStatusResponse,
  ReviewFormData,
  RoleSubmissionData,
  RoleSubmissionResponse,
  SignInResponse,
  UnlistedPropertyReview,
} from "@/types/generated";
import { TokenManager } from "@/utils/tokenManager";
import { LocationPayload } from "@/app/context/RevievFormContext";

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

  httpSignIn = async (data: FormData): Promise<SignInResponse> => {
    try {
      const response = await AxiosInstance.post(endpoints.signin, {
        email: data.email,
        password: data.password,
      });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };

  httpGoogleAuthCallback = async (googleData: any): Promise<SignInResponse> => {
    try {
      const response = await AxiosInstance.post(endpoints.googleAuth, googleData);
      return response.data;
    } catch (error: any) {
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
  httpGetAuthStatus = async () => {
    const token = TokenManager.getToken();
    if (!token) throw new Error("No authentication token found.");

    try {
      const { data } = await AxiosInstance.get(endpoints.getAuthStatus, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return data;
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
  httpUpdateProfile = async (data: any): Promise<RoleSubmissionResponse> => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      if (!token) throw new Error("No authentication token found.");

      console.log('Update Data', data)

      let payloadToSend: any = data;
      let headers: any = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      };
        payloadToSend = data;

      const response = await AxiosInstance.patch(
        endpoints.updateProfile,
        data,
        { headers }
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
  httpUpdatePropertyToggleLike = async (id: string, data: any): Promise<RoleSubmissionResponse> => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      if (!token) throw new Error("No authentication token found.");

      const response = await AxiosInstance.patch(
        endpoints.propertyToggleLike(id),
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
        TokenManager.clearAllTokens();
        window.location.href = "/signin";
      }
      throw error;
    }
  };
  httpGetUsersActivities = async (): Promise<RoleSubmissionResponse> => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");
      console.log("Tonek", token);
      if (!token) throw new Error("No authentication token found.");

      const response = await AxiosInstance.get(endpoints.getUsersActivities, {
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
  httpGetUsersFavorites = async (): Promise<RoleSubmissionResponse> => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");
      console.log("Tonek", token);
      if (!token) throw new Error("No authentication token found.");

      const response = await AxiosInstance.get(endpoints.getUsersActivities, {
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

  httpGetOnboardingStatus = async (): Promise<OnboardingStatusResponse> => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      console.log("Token for onboarding check:", token);

      if (!token) throw new Error("No authentication token found.");

      const response = await AxiosInstance.get(endpoints.getOnboardingStatus, {
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
  httpUpdateOnboardingStatus = async (): Promise<RoleSubmissionResponse> => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      console.log("Token", token);

      if (!token) throw new Error("No authentication token found.");

      // Fix: Move headers to the correct position and use proper method
      const response = await AxiosInstance.patch(
        endpoints.updateOnboardingStatus,
        {}, // Empty body for PATCH request
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
  httpCreateListings = async (data: globalThis.FormData) => {
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
          // Do not set Content-Type so Axios can set the correct boundary for FormData
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
  httpWriteUnlistedReview = async (data: LocationPayload) => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");

      if (!token) {
        localStorage.setItem("unlistedReviewData", JSON.stringify(data));
        window.location.href = "/signin";
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
  httpSearchReviews = async (fullAddress: string, apartment?: string) => {
    try {
      const params: any = { fullAddress };
      if (apartment) params.apartment = apartment;
      const response = await AxiosInstance.get("/reviews/search", {
        params,
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
  httpGetAllBlogPost = async (limit?: number, byId?: number) => {
    try {
      let url = endpoints.getAllBlogPost;

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
  httpGetAllBlogsById = async (id: string) => {
    try {
      const response = await AxiosInstance.get(`/blog/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Blogs not found");
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
