"use client";
export class TokenManager {
    private static readonly TOKEN_KEYS = ["authToken", "token", "accessToken"];
  
    static getToken(): string | null {
      for (const key of this.TOKEN_KEYS) {
        const token = localStorage.getItem(key);
        if (token) return token;
      }
      return null;
    }
  
    static setToken(newToken: string, preferredKey: string = "authToken"): void {
      this.clearAllTokens();
      localStorage.setItem(preferredKey, newToken);
    }

    static clearAllTokens(): void {
      this.TOKEN_KEYS.forEach(key => {
        localStorage.removeItem(key);
      });
    }
    static hasToken(): boolean {
      return this.getToken() !== null;
    }
  
    static updateFromResponse(response: any): boolean {
      const newToken = response?.token || response?.authToken || response?.accessToken;
      
      if (newToken) {
        this.setToken(newToken);
        return true;
      }
      
      return false;
    }
  }