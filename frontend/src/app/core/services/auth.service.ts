import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Role
} from '../models/user.model';
import { TokenService } from './token.service';
import { StorageService } from './storage.service';

const USER_KEY = 'auth_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);
  private readonly storageService = inject(StorageService);
  private readonly baseUrl = `${environment.apiUrl}/api/auth`;

  // Reactive state signals for UI reactivity
  readonly currentUser = signal<User | null>(this.getStoredUser());
  readonly isAuthenticated = signal<boolean>(this.isLoggedIn());

  constructor() {
    this.syncAuthState();
  }

  /**
   * Authenticate user with email and password
   */
  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response && response.data) {
          this.handleAuthSuccess(response.data);
        }
      })
    );
  }

  /**
   * Register a new user
   */
  register(data: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/register`, data).pipe(
      tap((response) => {
        if (response && response.data) {
          this.handleAuthSuccess(response.data);
        }
      })
    );
  }

  /**
   * Logout user, clear storage and navigate to login
   */
  logout(): void {
    this.tokenService.removeToken();
    this.storageService.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  /**
   * Retrieve JWT token from storage
   */
  getToken(): string | null {
    return this.tokenService.getToken();
  }

  /**
   * Retrieve current user role normalized (e.g. ROLE_FREELANCER or FREELANCER)
   */
  getUserRole(): string | null {
    const user = this.currentUser();
    if (user?.role) {
      return String(user.role);
    }

    const payload = this.tokenService.decodeToken();
    if (payload?.role) {
      return payload.role;
    }
    if (payload?.roles && payload.roles.length > 0) {
      return payload.roles[0];
    }
    return null;
  }

  /**
   * Retrieve current user ID
   */
  getUserId(): number | null {
    const user = this.currentUser();
    if (user?.userId != null) {
      return Number(user.userId);
    }
    if (user?.id != null) {
      return Number(user.id);
    }

    const payload = this.tokenService.decodeToken();
    if (payload?.userId != null) {
      return Number(payload.userId);
    }
    if (payload?.id != null) {
      return Number(payload.id);
    }
    return null;
  }

  /**
   * Check whether user is currently logged in
   */
  isLoggedIn(): boolean {
    const token = this.tokenService.getToken();
    if (!token) {
      return false;
    }

    if (this.tokenService.isTokenExpired()) {
      this.logout();
      return false;
    }

    return true;
  }

  /**
   * Helper to store session after successful login or registration
   */
  handleAuthSuccess(authData: AuthResponse): void {
    this.tokenService.setToken(authData.token);
    const user: User = {
      userId: authData.userId,
      id: authData.userId,
      email: authData.email,
      name: authData.name,
      role: authData.role,
      profession: authData.profession
    };
    this.storageService.setItem(USER_KEY, user);
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
  }

  private getStoredUser(): User | null {
    return this.storageService.getItem<User>(USER_KEY);
  }

  syncAuthState(): void {
    if (this.isLoggedIn()) {
      const stored = this.getStoredUser();
      if (stored) {
        this.currentUser.set(stored);
      } else {
        const payload = this.tokenService.decodeToken();
        if (payload) {
          this.currentUser.set({
            userId: payload.userId || payload.id,
            id: payload.userId || payload.id,
            email: payload.email || payload.sub,
            name: payload.name || '',
            role: payload.role || (payload.roles && payload.roles[0]) || ''
          });
        }
      }
      this.isAuthenticated.set(true);
    } else {
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
    }
  }
}
