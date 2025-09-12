"use client";
export class TokenManager {
  private static readonly TOKEN_KEYS = ["authToken", "token", "accessToken"];
  private static readonly PROFILE_ROUTE_KEY = "profileRoute";

  static getToken(): string | null {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return null;
    }
    for (const key of this.TOKEN_KEYS) {
      const token = localStorage.getItem(key);
      if (token) return token;
    }
    return null;
  }

  static setToken(newToken: string, preferredKey: string = "authToken"): void {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }
    this.clearAllTokens();
    localStorage.setItem(preferredKey, newToken);
  }

  static clearAllTokens(): void {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }
    this.TOKEN_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });
    localStorage.removeItem(this.PROFILE_ROUTE_KEY);
  }

  static hasToken(): boolean {
    return this.getToken() !== null;
  }

  static updateFromResponse(response: any): boolean {
    const newToken =
      response?.token || response?.authToken || response?.accessToken;

    if (newToken) {
      this.setToken(newToken);
      
      // Also store additional user data if available
      if (response?.user?.email) {
        localStorage.setItem("email", response.user.email);
      }
      if (response?.user?.role) {
        localStorage.setItem("userRole", response.user.role);
      }
      if (response?.user?.isOnboarded !== undefined) {
        localStorage.setItem("hasCompletedOnboarding", response.user.isOnboarded.toString());
      }
      
      return true;
    }

    return false;
  }

  static setProfileRoute(route: string): void {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }
    localStorage.setItem(this.PROFILE_ROUTE_KEY, route);
  }

  static getProfileRoute(): string | null {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return null;
    }
    return localStorage.getItem(this.PROFILE_ROUTE_KEY);
  }
}
