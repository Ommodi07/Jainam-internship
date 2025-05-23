import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'projects/cms-lib/src/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async login() {
    const success = await this.authService.login(this.username, this.password);
    loggedinuser : this.username;
    if (success) {
      this.snackBar.open('Login successful!', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        panelClass: ['snackbar-success']
      });
      this.router.navigate(['/creditcards']);
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}
