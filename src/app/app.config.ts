import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideKeycloak } from 'keycloak-angular';


export const appConfig: ApplicationConfig = {
    providers: [
        provideKeycloak({
            config: {
                url: 'http://localhost:8181',
                realm: 'dmn_studio',
                clientId: 'angular-frontend'
            },
            initOptions: {
                onLoad: 'login-required',
                checkLoginIframe: false,
                redirectUri: 'http://localhost:4200/',
                silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
                enableLogging: true
            }
        }),
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideHttpClient()
    ]
};
