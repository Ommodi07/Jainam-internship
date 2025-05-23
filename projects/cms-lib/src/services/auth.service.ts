import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedInStatus = false;
  private usersUrl = 'assets/user.json';

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string): Promise<boolean> {
    return this.http.get<any[]>(this.usersUrl).toPromise().then(users => {
      if (users && Array.isArray(users)) {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          this.isLoggedInStatus = true;
          localStorage.setItem('isLoggedIn', 'true');
          return true;
        }
      }
      return false;
    }).catch(err => {
      console.error('Login error:', err);
      return false;
    });
  }


  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.isLoggedInStatus = false;
  }
}