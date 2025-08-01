import axios from "axios";
import endpoints from "./endpoints";
import type {
  Category,
  userLocationData,
  FormData,
  FormValues,
  OnboardingStatusResponse,
  PropertyCategory,
  ReviewFormData,
  RoleSubmissionData,
  RoleSubmissionResponse,
  SignInResponse,
  UnlistedPropertyReview,
  ReviewsQueryData,
} from "@/types/generated";
import { TokenManager } from "@/utils/tokenManager";
import {
  AdminClaimedPropertiesResponse,
  AdminClaimedProperty,
  AdminOverviewResponse,
  AdminReviews,
  AdminReviewsResponse,
  ApiClaimResponse,
} from "@/types/admin";
import {
  AdminPropertiesResponse,
  AdminProperty,
  AdminUser,
  AdminUsersResponse,
} from "@/types/admin";

const AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenManager.getToken();
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
      const response = await AxiosInstance.post(
        endpoints.googleAuth,
        googleData
      );
      console.log("Data", response.data);
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
  httpGetUsersLocation = async (countryCode: string) => {
    try {
      const token = TokenManager.getToken();
      if (!token) throw new Error("No authentication token found.");
      const response = await AxiosInstance.get(endpoints.getUserLocation, {
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
      console.log("Update Data", data);
      let payloadToSend: any = data;
      let headers: any = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
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
  httpUpdatePropertyToggleLike = async (
    id: string,
    data: any
  ): Promise<RoleSubmissionResponse> => {
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
  httpUpdateAllNotificationsAsRead =
    async (): Promise<RoleSubmissionResponse> => {
      try {
        const token =
          localStorage.getItem("authToken") ||
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken");
        if (!token) throw new Error("No authentication token found.");
        const response = await AxiosInstance.patch(
          endpoints.updateAllNotificationsAsRead,
          {},
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
  httpUpdateNotificationsAsRead = async (
    id: string,
    data: any
  ): Promise<RoleSubmissionResponse> => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found.");
      const response = await AxiosInstance.patch(
        endpoints.updateNotificationAsRead(id),
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
  httpUpdateNotificationAsRead = async (
    id: string
  ): Promise<RoleSubmissionResponse> => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found.");
      const response = await AxiosInstance.patch(
        `/notifications/${id}/read`,
        {},
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
  httpDeleteNotifications = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    try {
      const response = await AxiosInstance.delete(
        endpoints.deleteNotificationById(id),
        {
          headers: {
            Authorization: ` ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to Delete Notification", error);
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
      const response = await AxiosInstance.patch(
        endpoints.updateOnboardingStatus,
        {},
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
  httpWriteReview = async (id: string, data: UnlistedPropertyReview) => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");
      if (!token) {
        localStorage.setItem("pendingReviewData", JSON.stringify({ id, data }));
        window.location.href = "/signin";
        throw new Error("No authentication token found. Please login again.");
      }
      const response = await AxiosInstance.post(`reviews/${id}`, data, {
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
        localStorage.setItem("pendingReviewData", JSON.stringify({ id, data }));
        window.location.href = "/signin";
      }
      throw error;
    }
  };
  httpClaimProperty = async (id: string, data: any) => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }
      const response = await AxiosInstance.post(
        endpoints.claimProperties(id),
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
      console.log(data);
      const response = await AxiosInstance.post(endpoints.createListing, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
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

  // httpGetAllReviews = async ({
  //   limit,
  //   sortBy,
  //   sortOrder,
  //   countryCode,
  //   page,
  //   apartment,
  //   searchQuery,
  // }: {
  //   limit?: number;
  //   sortBy?: string;
  //   sortOrder?: string;
  //   countryCode?: string;
  //   page?: number;
  //   apartment?: string;
  //   searchQuery?: string;
  // }): Promise<ReviewsQueryData> => {
  //   try {
  //     let url = endpoints.getAllReviews;
  //     const params = new URLSearchParams();
  //     if (sortBy) {
  //       params.append("sortBy", sortBy);
  //     }
  //     if (sortOrder) {
  //       params.append("sortOrder", sortOrder);
  //     }
  //     if (limit) {
  //       params.append("limit", limit.toString());
  //     }
  //     if (countryCode) {
  //       params.append("countryCode", countryCode);
  //     }
  //     if (page) {
  //       params.append("page", page.toString());
  //     }
  //     if (apartment) {
  //       // Explicitly encode spaces as %20 to match Postman
  //       params.append("apartment", encodeURIComponent(apartment));
  //     }
  //     if (searchQuery) {
  //       params.append("q", encodeURIComponent(searchQuery));
  //     }
  //     if (params.toString()) {
  //       url += `?${params.toString()}`;
  //     }
  //     console.log("API Request URL:", url); // Debug
  //     const response = await AxiosInstance.get(url);
  //     return response.data;
  //   } catch (error: any) {
  //     console.error("API Error:", error.response?.data || error.message); // Debug
  //     throw new Error(
  //       error.response?.data?.message || "Failed to fetch reviews"
  //     );
  //   }
  // };

  httpGetAllReviews = async ({
    limit,
    // sortBy,
    // sortOrder,
    countryCode,
    page,
    apartment,
    searchQuery,
  }: {
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    countryCode?: string;
    page?: number;
    apartment?: string;
    searchQuery?: string;
  }): Promise<ReviewsQueryData> => {
    try {
      let url = endpoints.getAllReviews;
      const params = new URLSearchParams();
      // if (sortBy) params.append("sortBy", sortBy);
      // if (sortOrder) params.append("sortOrder", sortOrder);
      if (limit) params.append("limit", limit.toString());
      if (countryCode) params.append("countryCode", countryCode);
      if (page) params.append("page", page.toString());
      if (apartment) params.append("apartment", encodeURIComponent(apartment));
      if (searchQuery) params.append("q", encodeURIComponent(searchQuery));
      if (params.toString()) url += `?${params.toString()}`;
      console.log("API Request URL:", url); // Debug
      const response = await AxiosInstance.get(url);
      console.log("API Response:", response.data); // Debug
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message); // Debug
      throw new Error(
        error.response?.data?.message || "Failed to fetch reviews"
      );
    }
  };
  httpGetAllNotifications = async (
    limit?: number,
    sortBy?: string,
    sortOrder?: string
  ) => {
    try {
      let url = endpoints.getAllNotifications;
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
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      const response = await AxiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Search failed");
    }
  };
  httpGetAllProperties = async (limit?: number, byId?: number) => {
    try {
      let url = "/listings";
      const params = new URLSearchParams({ category: "Swap" });
      if (byId) {
        params.append("byId", byId.toString());
      }
      if (limit) {
        params.append("limit", limit.toString());
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      console.log("[httpGetAllProperties] Requesting URL:", url);
      const response = await AxiosInstance.get(url);
      console.log("[httpGetAllProperties] Response data:", response.data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Get all listings failed"
      );
    }
  };
  httpUpdateReviewsToggleLike = async (
    id: string,
    data: any
  ): Promise<RoleSubmissionResponse> => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found.");
      const response = await AxiosInstance.patch(
        endpoints.ReviewLikesToggle(id),
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
  httpUpdateReviewsFlag = async (
    id: string,
    data: any
  ): Promise<RoleSubmissionResponse> => {
    try {
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");
      if (!token) throw new Error("No authentication token found.");
      const response = await AxiosInstance.post(
        endpoints.flagReview(id),
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

  httpGetAllListings = async (
    limit?: number,
    byId?: number,
    category?: PropertyCategory,
    country: string = "Estonia"
  ) => {
    try {
      let url = endpoints.getAllListings;
      const params = new URLSearchParams();
      if (byId) {
        params.append("byId", byId.toString());
      }
      if (limit) {
        params.append("limit", limit.toString());
      }
      if (category) {
        params.append("category", category);
      }
      if (country) {
        params.append("country", country);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      console.log("[httpGetAllListings] Requesting URL:", url);
      const response = await AxiosInstance.get(url);
      console.log("[httpGetAllListings] Response data:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("[httpGetAllListings] Error fetching listings:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw new Error(
        error.response?.data?.message || "Get all listings failed"
      );
    }
  };
  httpGetAllMyListings = async (limit?: number, byId?: number) => {
    try {
      let url = endpoints.getAllMyListings;
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
        error.response?.data?.message || "Get all My listings failed"
      );
    }
  };
  httpGetAllBlogPost = async (limit?: number, byId?: number) => {
    try {
      let url = endpoints.getAllBlogPost;
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
      const response = await AxiosInstance.get(endpoints.getListingById(id));
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Listing not found");
    }
  };

  httpGetPropertiesById = async (id: string) => {
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

  httpDeleteNotificationById = async (id: string): Promise<void> => {
    const token =
      localStorage.getItem("authToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken");
    if (!token) throw new Error("No authentication token found.");
    await AxiosInstance.delete(`/notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  // ==Admin methods====//
  httpGetAdminOverviewStatus = async (
    limit?: number,
    byId?: number
  ): Promise<AdminOverviewResponse> => {
    try {
      let url = endpoints.getAdminOverviewStatus;
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
      const response = await AxiosInstance.get<AdminOverviewResponse>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Get admin overview status failed"
      );
    }
  };

  httpGetAdminAllProperties = async (
    limit?: number,
    byId?: number
  ): Promise<AdminPropertiesResponse> => {
    try {
      let url = endpoints.getAdminProperties;
      const params = new URLSearchParams();
      if (byId) params.append("byId", byId.toString());
      if (limit) params.append("limit", limit.toString());
      if (params.toString()) url += `?${params.toString()}`;
      const response = await AxiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Get all Propertyies failed"
      );
    }
  };

  httpGetAdminPropertyById = async (id: string): Promise<AdminProperty> => {
    try {
      const response = await AxiosInstance.get(
        endpoints.getAdminPropertyById(id)
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Get property failed");
    }
  };
  httpUpdateAdminProperty = async (
    id: string,
    data: Partial<AdminProperty>
  ): Promise<AdminProperty> => {
    try {
      const payload = {
        ...data,
        price: data.price ? Number(data.price) : undefined,
      };
      console.log(
        "Sending PATCH request to:",
        endpoints.updateAdminProperty(id)
      );
      console.log("Payload:", payload);
      const response = await AxiosInstance.patch(
        endpoints.updateAdminProperty(id),
        payload
      );
      console.log("Response Data:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Update property failed:", {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        headers: error.response?.headers,
        request: {
          url: endpoints.updateAdminProperty(id),
          data,
        },
      });
      throw new Error(
        error.response?.data?.message || "Update property failed"
      );
    }
  };
  httpDeleteAdminProperty = async (id: string): Promise<void> => {
    try {
      await AxiosInstance.delete(endpoints.deleteAdminProperty(id));
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Delete property failed"
      );
    }
  };

  // ==== ADMIN USERS ======
  httpGetAdminAllUsers = async (
    limit?: number,
    byId?: number
  ): Promise<AdminUsersResponse> => {
    try {
      let url = endpoints.getAllAdminUsers;
      const params = new URLSearchParams();
      if (byId) params.append("byId", byId.toString());
      if (limit) params.append("limit", limit.toString());
      if (params.toString()) url += `?${params.toString()}`;
      const response = await AxiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Get all Admin Users failed"
      );
    }
  };
  httpGetAdminUsersById = async (id: string): Promise<AdminUser> => {
    try {
      const response = await AxiosInstance.get(endpoints.getAdminUsersById(id));
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Get User failed");
    }
  };
  httpUpdateAdminUser = async (
    id: string,
    data: Partial<AdminUser>
  ): Promise<AdminUsersResponse> => {
    try {
      const payload = {
        ...data,
        isActive: data.Deactivated !== undefined ? data.Deactivated : undefined,
      };
      console.log(
        "Sending PATCH request to:",
        endpoints.toggleAdminUserDeactivate(id)
      );
      console.log("Payload:", payload);
      const response = await AxiosInstance.patch(
        endpoints.updateAdminProperty(id),
        payload
      );
      console.log("Response Data:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Update property failed:", {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        headers: error.response?.headers,
        request: {
          url: endpoints.updateAdminProperty(id),
          data,
        },
      });
      throw new Error(
        error.response?.data?.message || "Update property failed"
      );
    }
  };
  httpDeleteAdminUserById = async (id: string): Promise<void> => {
    try {
      await AxiosInstance.delete(endpoints.deleteAdminUser(id));
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Delete Admin User failed"
      );
    }
  };

  // ADMIN REVIEWS ====
  httpGetAdminAllReviews = async (
    limit?: number,
    byId?: number
  ): Promise<AdminReviewsResponse> => {
    try {
      let url = endpoints.getAllAdminReviews;
      const params = new URLSearchParams();
      if (byId) params.append("byId", byId.toString());
      if (limit) params.append("limit", limit.toString());
      if (params.toString()) url += `?${params.toString()}`;
      const response = await AxiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Get all Admin Reviews failed"
      );
    }
  };
  httpGetAdminReviewById = async (id: string): Promise<AdminReviews> => {
    try {
      const response = await AxiosInstance.get(
        endpoints.getAdminReviewsById(id)
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Get Review failed");
    }
  };
  httpDeleteAdminReviewById = async (id: string): Promise<void> => {
    try {
      await AxiosInstance.delete(endpoints.deleteAdminReviewsById(id));
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Delete Admin Review failed"
      );
    }
  };

  // === ADMIN CLAIM PROPERTIES ==== //
  httpGetAdminAllClaimedProperties = async (
    limit?: number,
    page?: number
  ): Promise<AdminClaimedPropertiesResponse> => {
    try {
      let url = endpoints.getAllAdminPropertyClaims;
      const params = new URLSearchParams();
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());
      if (params.toString()) url += `?${params.toString()}`;
      const response = await AxiosInstance.get(url);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Get all Claimed Properties failed"
      );
    }
  };
  httpGetAdminClaimedPropertyDetails = async (
    id: string
  ): Promise<ApiClaimResponse> => {
    try {
      const response = await AxiosInstance.get(
        endpoints.getAdminPropertyClaimDetails(id)
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Get Claimed Property failed"
      );
    }
  };
  httpUpdateAdminApproveClaimedProperty = async (
    id: string,
    data: { status: "approved" | "pending" | "rejected" }
  ): Promise<ApiClaimResponse> => {
    try {
      const payload = {
        status: data.status,
      };
      console.log(
        "Sending PATCH request to:",
        endpoints.approvePropertyClaim(id)
      );
      console.log("Payload:", payload);
      const response = await AxiosInstance.patch(
        endpoints.approvePropertyClaim(id),
        payload
      );
      console.log("Response Data:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Update claimed property failed:", {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        headers: error.response?.headers,
        request: {
          url: endpoints.updateAdminProperty(id),
          data,
        },
      });
      throw new Error(
        error.response?.data?.message || "Update claimed property failed"
      );
    }
  };
  httpUpdateAdminRejectClaimedProperty = async (
    id: string,
    data: Partial<AdminClaimedProperty>
  ): Promise<AdminClaimedProperty> => {
    try {
      const payload = {
        ...data,
      };
      console.log(
        "Sending PATCH request to:",
        endpoints.rejectPropertyClaim(id)
      );
      console.log("Payload:", data);
      const response = await AxiosInstance.patch(
        endpoints.rejectPropertyClaim(id),
        payload
      );
      console.log("Response Data:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Update claimed property failed:", {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
        headers: error.response?.headers,
        request: {
          url: endpoints.rejectPropertyClaim(id),
          data,
        },
      });
      throw new Error(
        error.response?.data?.message || "Update claimed property failed"
      );
    }
  };
}

const http = new BaseURL();
export default http;
