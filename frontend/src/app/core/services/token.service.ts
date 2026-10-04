import { Injectable } from '@angular/core';
import { JwtPayload } from '../models/jwt-payload.model';

const TOKEN_KEY = 'auth_token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  removeToken(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload) as JwtPayload;
    } catch {
      return null;
    }
  }

  isTokenExpired(): boolean {
    const payload = this.decodeToken();
    if (!payload?.exp) return false;
    const expirationDate = new Date(payload.exp * 1000);
    return expirationDate <= new Date();
  }
}
