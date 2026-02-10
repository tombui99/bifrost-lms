import { Injectable } from '@angular/core';
import { AuthService as ApiAuthService } from '../../api/api/auth.service';
import { LoginDto, RegisterDto } from '../../api/model/models';
import { BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { signal } from '@angular/core';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private tokenKey = 'bifrost_token';
  private roleKey = 'bifrost_role';
  private tenantKey = 'bifrost_tenant';
  private emailKey = 'bifrost_email';

  // To update UI reactively
  private userRoleSignal = signal<string | null>(this.getUserRole());
  public userRole = this.userRoleSignal.asReadonly();
  private emailSignal = signal<string | null>(this.getEmail());
  public email = this.emailSignal.asReadonly();

  constructor(
    private apiAuthService: ApiAuthService,
    private router: Router,
  ) {}

  login(credentials: LoginDto) {
    return this.apiAuthService.apiAuthLoginPost(credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.roleKey, response.role);
          localStorage.setItem(this.tenantKey, response.tenantId);
          localStorage.setItem(this.emailKey, response.email);
          this.userRoleSignal.set(response.role);
          this.emailSignal.set(response.email);
        }
      }),
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.tenantKey);
    this.userRoleSignal.set(null);
    this.emailSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  getEmail(): string | null {
    return localStorage.getItem(this.emailKey);
  }

  getTenantId(): string | null {
    return localStorage.getItem(this.tenantKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
