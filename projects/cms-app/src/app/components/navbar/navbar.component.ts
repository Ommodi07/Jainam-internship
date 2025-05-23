import { Component } from '@angular/core';
import { AuthService } from 'projects/cms-lib/src/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  sidebarOpen = false;

  toggleSidebar(){
    this.sidebarOpen = this.sidebarOpen? false : true;
  }

  constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
