import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AuthService } from './core/services/auth.service';
import { LayoutService } from './core/services/layout.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    NavbarComponent,
    SidebarComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  readonly authService = inject(AuthService);
  readonly layoutService = inject(LayoutService);

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  get isSidebarOpen(): boolean {
    return this.isLoggedIn && this.layoutService.sidebarOpen();
  }

  get isMobile(): boolean {
    return this.layoutService.isMobile();
  }

  onBackdropClick(): void {
    if (this.isMobile) {
      this.layoutService.setSidebarOpen(false);
    }
  }
}
