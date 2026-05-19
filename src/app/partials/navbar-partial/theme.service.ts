import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private darkMode = false;

  constructor() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      this.darkMode = savedTheme === 'dark';
    } else {
      this.darkMode = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
    }

    this.updateTheme();
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;

    localStorage.setItem(
      'theme',
      this.darkMode ? 'dark' : 'light'
    );

    this.updateTheme();
  }

  isDarkMode(): boolean {
    return this.darkMode;
  }

  private updateTheme(): void {
    document.body.setAttribute(
      'data-bs-theme',
      this.darkMode ? 'dark' : 'light'
    );
  }
}