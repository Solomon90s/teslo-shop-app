import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  #authStatus = signal('checking');
  #user = signal<User | null>(null);
  #token = signal<string | null>(null);

  #http = inject(HttpClient);

  checkStatusResource = rxResource({
    loader: () => this.checkAuthStatus(),
  });

  authStatus = computed<AuthStatus>(() => {
    if (this.#authStatus() === 'checking') return 'checking';
    if (this.#user()) {
      return 'authenticated';
    }
    return 'not-authenticated';
  });

  user = computed<User | null>(() => this.#user());
  token = computed(this.#token);

  login(email: string, password: string): Observable<boolean> {
    return this.#http
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((response) => this.handleLoginAuthSuccess(response)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }
    return this.#http
      .get<AuthResponse>(`${baseUrl}/auth/check-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .pipe(
        map((response) => this.handleLoginAuthSuccess(response)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  logout() {
    this.#user.set(null);
    this.#token.set(null);
    this.#authStatus.set('not-authenticated');
    localStorage.clear();
  }

  private handleLoginAuthSuccess({ user, token }: AuthResponse) {
    this.#user.set(user);
    this.#authStatus.set('authenticated');
    this.#token.set(token);

    localStorage.setItem('token', token);
    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }
}
