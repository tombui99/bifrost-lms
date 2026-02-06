import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translate = inject(TranslateService);

  private readonly LANG_KEY = 'preferredLang';
  currentLang = signal<string>(localStorage.getItem(this.LANG_KEY) || 'en');

  constructor() {
    this.translate.addLangs(['en', 'vi']);
    const browserLang = this.translate.getBrowserLang();
    const savedLang = localStorage.getItem(this.LANG_KEY);
    const initialLang = savedLang || (browserLang?.match(/en|vi/) ? browserLang : 'en');
    console.log('LanguageService: Initializing with', initialLang);
    this.translate.use(initialLang);
  }

  setLanguage(lang: string) {
    console.log('LanguageService: Switching to', lang);
    this.currentLang.set(lang);
    this.translate.use(lang);
    localStorage.setItem(this.LANG_KEY, lang);
  }

  toggleLanguage() {
    const newLang = this.currentLang() === 'en' ? 'vi' : 'en';
    this.setLanguage(newLang);
  }
}
