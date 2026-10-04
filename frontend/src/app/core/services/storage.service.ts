import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  getItem<T>(key: string): T | null {
    if (!this.isBrowser()) return null;
    const item = localStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  }

  setItem(key: string, value: any): void {
    if (!this.isBrowser()) return;
    if (typeof value === 'string') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  removeItem(key: string): void {
    if (!this.isBrowser()) return;
    localStorage.removeItem(key);
  }

  clear(): void {
    if (!this.isBrowser()) return;
    localStorage.clear();
  }
}
