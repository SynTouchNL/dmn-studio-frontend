import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideKeycloak } from 'keycloak-angular';
import { environment } from './../environments/environment';

export const appConfig: ApplicationConfig = {
    providers: [
        provideKeycloak({
            config: {
                url: environment.keycloak.url,
                realm: environment.keycloak.realm,
                clientId: environment.keycloak.clientId
            },
            initOptions: {
                onLoad: 'login-required',
                checkLoginIframe: false,
                redirectUri: environment.keycloak.redirect,
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
