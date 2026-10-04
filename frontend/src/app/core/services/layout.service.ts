import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  // Sidebar expanded / collapsed state
  readonly sidebarOpen = signal<boolean>(true);
  readonly isMobile = signal<boolean>(false);

  constructor() {
    this.checkScreenSize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => this.checkScreenSize());
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  setSidebarOpen(open: boolean): void {
    this.sidebarOpen.set(open);
  }

  private checkScreenSize(): void {
    if (typeof window !== 'undefined') {
      const mobile = window.innerWidth < 960;
      this.isMobile.set(mobile);
      if (mobile) {
        this.sidebarOpen.set(false);
      }
    }
  }
}
