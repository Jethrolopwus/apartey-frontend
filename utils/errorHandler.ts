import toast from "react-hot-toast";

export interface ErrorDetails {
  status?: number;
  code?: string;
  message?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
}

export class ErrorHandler {
  /**
   * Convert unknown error to ErrorDetails
   */
  private static toErrorDetails(error: unknown): ErrorDetails {
    if (error && typeof error === 'object') {
      return error as ErrorDetails;
    }
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: String(error) };
  }

  /**
   * Handle authentication-related errors
   */
  static handleAuthError(error: unknown): void {
    const errorDetails = this.toErrorDetails(error);
    console.error("Authentication Error:", errorDetails);

    const status = errorDetails?.status || errorDetails?.response?.status;

    if (status === 401) {
      toast.error("Authentication failed. Please sign in again.");
    } else if (status === 403) {
      toast.error("Access denied. Your account may not have the required permissions.");
    } else if (status === 404) {
      toast.error("Authentication service not found. Please contact support.");
    } else if (status === 409) {
      toast.error("Account already exists. Please try signing in instead of signing up.");
    } else if (status === 422) {
      toast.error("Invalid account data. Please check your information and try again.");
    } else if (status && status >= 500) {
      toast.error("Server error occurred. Please try again in a few moments.");
    } else if (errorDetails?.code === 'NETWORK_ERROR' || errorDetails?.message?.includes('Network Error')) {
      toast.error("Network connection failed. Please check your internet connection and try again.");
    } else if (errorDetails?.message?.includes('timeout')) {
      toast.error("Request timed out. Please try again.");
    } else if (errorDetails?.response?.data?.message) {
      toast.error(errorDetails.response.data.message);
    } else {
      toast.error("Authentication failed. Please try again or contact support if the issue persists.");
    }
  }

  /**
   * Handle Google OAuth specific errors
   */
  static handleGoogleOAuthError(error: unknown): void {
    const errorDetails = this.toErrorDetails(error);
    console.error("Google OAuth Error:", errorDetails);

    if (errorDetails?.code === 'access_denied') {
      toast.error("Google sign-in was cancelled. Please try again if you want to continue.");
    } else if (errorDetails?.code === 'popup_closed_by_user') {
      toast.error("Sign-in popup was closed. Please try again.");
    } else if (errorDetails?.code === 'popup_blocked') {
      toast.error("Popup was blocked by your browser. Please allow popups and try again.");
    } else if (errorDetails?.code === 'invalid_request') {
      toast.error("Invalid request. Please try again or contact support.");
    } else if (errorDetails?.code === 'unauthorized_client') {
      toast.error("Google OAuth configuration error. Please contact support.");
    } else if (errorDetails?.code === 'unsupported_response_type') {
      toast.error("OAuth response type not supported. Please contact support.");
    } else if (errorDetails?.code === 'invalid_scope') {
      toast.error("Invalid OAuth scope. Please contact support.");
    } else if (errorDetails?.code === 'server_error') {
      toast.error("Google server error. Please try again later.");
    } else if (errorDetails?.code === 'temporarily_unavailable') {
      toast.error("Google service temporarily unavailable. Please try again later.");
    } else if (errorDetails?.message?.includes('network')) {
      toast.error("Network error occurred. Please check your connection and try again.");
    } else {
      toast.error("Google sign-in failed. Please try again or use email/password instead.");
    }
  }

  /**
   * Handle API/Backend errors
   */
  static handleApiError(error: ErrorDetails): void {
    console.error("API Error:", error);

    const status = error?.status || error?.response?.status;

    if (status === 400) {
      toast.error("Invalid request. Please check your input and try again.");
    } else if (status === 401) {
      toast.error("Authentication required. Please sign in again.");
    } else if (status === 403) {
      toast.error("Access denied. You don't have permission to perform this action.");
    } else if (status === 404) {
      toast.error("Resource not found. Please check your request and try again.");
    } else if (status === 409) {
      toast.error("Conflict occurred. The resource may already exist or be in use.");
    } else if (status === 422) {
      toast.error("Validation error. Please check your input and try again.");
    } else if (status === 429) {
      toast.error("Too many requests. Please wait a moment and try again.");
    } else if (status && status >= 500) {
      toast.error("Server error occurred. Please try again later or contact support.");
    } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
      toast.error("Network connection failed. Please check your internet connection.");
    } else if (error?.message?.includes('timeout')) {
      toast.error("Request timed out. Please try again.");
    } else if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error?.response?.data?.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error("An unexpected error occurred. Please try again or contact support.");
    }
  }

  /**
   * Handle network connectivity errors
   */
  static handleNetworkError(error: any): void {
    console.error("Network Error:", error);

    if (!navigator.onLine) {
      toast.error("You are currently offline. Please check your internet connection and try again.");
    } else if (error?.code === 'NETWORK_ERROR') {
      toast.error("Network connection failed. Please check your internet connection and try again.");
    } else if (error?.message?.includes('timeout')) {
      toast.error("Request timed out. Please try again.");
    } else if (error?.message?.includes('Failed to fetch')) {
      toast.error("Unable to connect to the server. Please check your internet connection and try again.");
    } else {
      toast.error("Network error occurred. Please check your connection and try again.");
    }
  }

  /**
   * Handle form validation errors
   */
  static handleValidationError(error: any): void {
    console.error("Validation Error:", error);

    if (error?.response?.data?.errors) {
      const errors = error.response.data.errors;
      if (Array.isArray(errors)) {
        errors.forEach((err: any) => {
          toast.error(err.message || "Validation error occurred.");
        });
      } else {
        Object.values(errors).forEach((err: any) => {
          toast.error(err.message || "Validation error occurred.");
        });
      }
    } else if (error?.response?.data?.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Please check your input and try again.");
    }
  }

  /**
   * Handle file upload errors
   */
  static handleFileUploadError(error: any): void {
    console.error("File Upload Error:", error);

    if (error?.message?.includes('File too large')) {
      toast.error("File is too large. Please choose a smaller file.");
    } else if (error?.message?.includes('Invalid file type')) {
      toast.error("Invalid file type. Please choose a supported file format.");
    } else if (error?.message?.includes('Upload failed')) {
      toast.error("File upload failed. Please try again.");
    } else if (error?.status === 413 || error?.response?.status === 413) {
      toast.error("File is too large. Please choose a smaller file.");
    } else if (error?.status === 415 || error?.response?.status === 415) {
      toast.error("Unsupported file type. Please choose a different file.");
    } else {
      this.handleApiError(error);
    }
  }

  /**
   * Generic error handler that tries to determine the error type
   */
  static handleError(error: any, context?: string): void {
    console.error(`Error in ${context || 'unknown context'}:`, error);

    // Check if it's a network error first
    if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error') || !navigator.onLine) {
      this.handleNetworkError(error);
      return;
    }

    // Check if it's an API error
    if (error?.response || (error?.status !== undefined)) {
      this.handleApiError(error);
      return;
    }

    // Check if it's a Google OAuth error
    if (error?.error && typeof error.error === 'string') {
      this.handleGoogleOAuthError(error);
      return;
    }

    // Check if it's a validation error
    if (error?.response?.data?.errors || error?.response?.status === 422) {
      this.handleValidationError(error);
      return;
    }

    // Default error message
    toast.error("An unexpected error occurred. Please try again or contact support if the issue persists.");
  }

  /**
   * Show success message
   */
  static showSuccess(message: string): void {
    toast.success(message);
  }

  /**
   * Show info message
   */
  static showInfo(message: string): void {
    toast(message, {
      icon: 'ℹ️',
      style: {
        borderRadius: '10px',
        background: '#3B82F6',
        color: '#fff',
      },
    });
  }

  /**
   * Show warning message
   */
  static showWarning(message: string): void {
    toast(message, {
      icon: '⚠️',
      style: {
        borderRadius: '10px',
        background: '#F59E0B',
        color: '#fff',
      },
    });
  }

  /**
   * Get error message without showing toast (for throwing errors)
   */
  static getErrorMessage(error: any, context: 'authentication' | 'api' | 'network' | 'validation' = 'api'): string {
    if (context === 'authentication') {
      const status = error?.status || error?.response?.status;
      
      if (status === 401) {
        return "Authentication failed. Please check your credentials and try again.";
      } else if (status === 403) {
        return "Access denied. Your account may not have the required permissions.";
      } else if (status === 404) {
        return "Authentication service not found. Please contact support.";
      } else if (status === 409) {
        return "Account already exists. Please try signing in instead of signing up.";
      } else if (status === 422) {
        return "Invalid account data. Please try again or contact support.";
      } else if (status && status >= 500) {
        return "Server error occurred. Please try again in a few moments.";
      } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
        return "Network connection failed. Please check your internet connection and try again.";
      } else if (error?.message?.includes('timeout')) {
        return "Request timed out. Please try again.";
      } else if (error?.response?.data?.message) {
        return error.response.data.message;
      } else {
        return "Authentication failed. Please try again or contact support if the issue persists.";
      }
    }

    if (context === 'api') {
      const status = error?.status || error?.response?.status;
      
      if (status === 400) {
        return "Invalid request. Please check your input and try again.";
      } else if (status === 401) {
        return "Authentication required. Please sign in again.";
      } else if (status === 403) {
        return "Access denied. You don't have permission to perform this action.";
      } else if (status === 404) {
        return "Resource not found. Please check your request and try again.";
      } else if (status === 409) {
        return "Conflict occurred. The resource may already exist or be in use.";
      } else if (status === 422) {
        return "Validation error. Please check your input and try again.";
      } else if (status === 429) {
        return "Too many requests. Please wait a moment and try again.";
      } else if (status && status >= 500) {
        return "Server error occurred. Please try again later or contact support.";
      } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
        return "Network connection failed. Please check your internet connection.";
      } else if (error?.message?.includes('timeout')) {
        return "Request timed out. Please try again.";
      } else if (error?.response?.data?.message) {
        return error.response.data.message;
      } else if (error?.response?.data?.error) {
        return error.response.data.error;
      } else {
        return "An unexpected error occurred. Please try again or contact support.";
      }
    }

    if (context === 'network') {
      if (!navigator.onLine) {
        return "You are currently offline. Please check your internet connection and try again.";
      } else if (error?.code === 'NETWORK_ERROR') {
        return "Network connection failed. Please check your internet connection and try again.";
      } else if (error?.message?.includes('timeout')) {
        return "Request timed out. Please try again.";
      } else if (error?.message?.includes('Failed to fetch')) {
        return "Unable to connect to the server. Please check your internet connection and try again.";
      } else {
        return "Network error occurred. Please check your connection and try again.";
      }
    }

    if (context === 'validation') {
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
          return errors.map((err: any) => err.message || "Validation error occurred.").join(", ");
        } else {
          return Object.values(errors).map((err: any) => err.message || "Validation error occurred.").join(", ");
        }
      } else if (error?.response?.data?.message) {
        return error.response.data.message;
      } else {
        return "Please check your input and try again.";
      }
    }

    return "An unexpected error occurred. Please try again or contact support if the issue persists.";
  }
}

export default ErrorHandler;
