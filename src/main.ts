import { bootstrapApplication } from '@angular/platform-browser';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {
    ApplicationConfig,
    provideZoneChangeDetection,
    provideBrowserGlobalErrorListeners,
    APP_INITIALIZER, provideAppInitializer, inject
} from '@angular/core';
import { provideKeycloak } from 'keycloak-angular';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { ConfigService } from './app/services/config-service/config-service';

const intializeAppFn = async () => {
    const configService = inject(ConfigService);
    const response = await fetch('/config.json');
    const config = await response.json();
    return configService.setConfig(config);
};

const initializeApp = async () => {
    try {
        const response = await fetch('/config.json');
        const config = await response.json();

        const appConfig: ApplicationConfig = {
            providers: [
                provideHttpClient(),
                provideAppInitializer(intializeAppFn),
                provideKeycloak({
                    config: {
                        url: config.keycloak.url,
                        realm: config.keycloak.realm,
                        clientId: config.keycloak.clientId
                    },
                    initOptions: {
                        onLoad: 'login-required',
                        checkLoginIframe: false,
                        redirectUri: config.redirect,
                        silentCheckSsoRedirectUri: globalThis.location.origin + '/assets/silent-check-sso.html',
                        enableLogging: true
                    }
                }),
                provideBrowserGlobalErrorListeners(),
                provideZoneChangeDetection({ eventCoalescing: true }),
                provideRouter(routes)
            ]
        };

        await bootstrapApplication(App, appConfig);
    } catch (error) {
        console.error('Failed to initialize the application:', error);
        throw error;
    }
};

void initializeApp();
