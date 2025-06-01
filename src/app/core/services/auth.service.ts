import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;

  constructor(
    private router: Router,
    private keycloakService: KeycloakService
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();

    // Evitar inicialización automática que puede causar bucles
    // Se inicializará cuando se necesite explícitamente
  }

  private async initializeUser(): Promise<void> {
    try {
      if (this.keycloakService.isLoggedIn()) {
        const user = await this.getUserFromKeycloak();
        this.currentUserSubject.next(user);
      }
    } catch (error) {
      console.error('Error initializing user:', error);
      this.currentUserSubject.next(null);
    }
  }

  private async getUserFromKeycloak(): Promise<User> {
    try {
      const userProfile = await this.keycloakService.loadUserProfile();
      const token = await this.keycloakService.getToken();

      return {
        id: userProfile.id || '',
        username: userProfile.username || '',
        name: `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim(),
        email: userProfile.email || '',
        role: this.getUserRole(),
        token: token || ''
      };
    } catch (error) {
      console.error('Error getting user from Keycloak:', error);
      throw error;
    }
  }

  private getUserRole(): string {
    const roles = this.keycloakService.getUserRoles();
    // Puedes personalizar la lógica para obtener el rol principal
    return roles.includes('admin') ? 'Admin' :
      roles.includes('farmer') ? 'Farmer' : 'User';
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.keycloakService.isLoggedIn();
  }

  async getToken(): Promise<string | null> {
    try {
      return await this.keycloakService.getToken();
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  // Método para inicializar el usuario cuando sea necesario
  async loadCurrentUser(): Promise<void> {
    await this.initializeUser();
  }

  login(): Observable<void> {
    return from(this.keycloakService.login({
      redirectUri: window.location.origin + '/dashboard',
      prompt: 'login'
    }));
  }

  logout(): void {
    this.keycloakService.logout(window.location.origin);
    this.currentUserSubject.next(null);
  }

  // Método para obtener los roles del usuario
  getUserRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }

  // Método para verificar si el usuario tiene un rol específico
  hasRole(role: string): boolean {
    return this.keycloakService.isUserInRole(role);
  }

  // Método para refrescar el token
  async refreshToken(): Promise<boolean> {
    try {
      const refreshed = await this.keycloakService.updateToken(30);
      if (refreshed) {
        const user = await this.getUserFromKeycloak();
        this.currentUserSubject.next(user);
      }
      return refreshed;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return false;
    }
  }
}