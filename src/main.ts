import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routes } from './app/app-routing.module';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost:8085',
        realm: 'mi-realm',
        clientId: 'mi-api'
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        checkLoginIframe: false, // Cambiado a false para evitar problemas
        pkceMethod: 'S256',
        enableLogging: true // Habilitamos logging para debug
      },
      bearerExcludedUrls: ['/assets']
    });
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule,
      KeycloakAngularModule
    ),
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ]
}).catch(err => console.error(err));