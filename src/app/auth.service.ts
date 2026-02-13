import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';

export interface User {
  id: number;
  email: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiBase = 'http://localhost:3000';

  constructor(private router: Router, private http: HttpClient) {}

  // LocalStorage-based login (checks against values stored in localStorage)
  loginLocal(email: string, password: string): Observable<User | null> {
    const storedEmail = localStorage.getItem('email') || 'admin@gmail.com';
    const storedPassword = localStorage.getItem('password') || 'admin';

    if (email === storedEmail && password === storedPassword) {
      const user: User = { id: 0, email, name: 'Local User' };
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
      return of(user);
    }
    return of(null);
  }

  // API-based login: queries /users?email=...&password=... using HttpClient
  loginApi(email: string, password: string): Observable<User | null> {
    const url = `${this.apiBase}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    return this.http.get<User[]>(url).pipe(
      map(users => {
        if (Array.isArray(users) && users.length > 0) {
          const u = users[0];
          const user: User = { id: u.id, email: u.email, name: u.name };
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('currentUser', JSON.stringify(user));
          return user;
        }
        return null;
      }),
      catchError(e => {
        console.error('API login error', e);
        return of(null);
      })
    );
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  getCurrentUser(): User | null {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}
