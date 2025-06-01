import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard extends KeycloakAuthGuard implements CanActivate {

  constructor(
    protected override router: Router,
    protected keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {

    try {
      // Verificar si el usuario está autenticado
      const isAuth = await this.keycloak.isLoggedIn();

      if (!isAuth) {
        console.log('Usuario no autenticado, redirigiendo a login...');
        await this.keycloak.login({
          redirectUri: window.location.origin + state.url,
          prompt: 'login'
        });
        return false;
      }

      // Verificar si tenemos un token válido
      const token = await this.keycloak.getToken();
      if (!token) {
        console.log('Token no encontrado, redirigiendo a login...');
        await this.keycloak.login({
          redirectUri: window.location.origin + state.url,
          prompt: 'login'
        });
        return false;
      }

      // Verificar roles si están definidos en la ruta
      const requiredRoles = route.data?.['roles'] as string[];
      if (requiredRoles && requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some(role =>
          this.keycloak.isUserInRole(role)
        );

        if (!hasRequiredRole) {
          console.warn('Usuario no tiene los roles requeridos:', requiredRoles);
          return this.router.parseUrl('/dashboard');
        }
      }

      return true;
    } catch (error) {
      console.error('Error en AuthGuard:', error);
      return false;
    }
  }

  // Método auxiliar para verificar roles específicos
  private hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.keycloak.isUserInRole(role));
  }

  // Método auxiliar para verificar todos los roles
  private hasAllRoles(roles: string[]): boolean {
    return roles.every(role => this.keycloak.isUserInRole(role));
  }
}