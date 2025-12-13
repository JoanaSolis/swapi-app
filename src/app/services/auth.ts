import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(
    private storage: StorageService,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(null);
    this.currentUser = this.currentUserSubject.asObservable();
    this.loadUser();
  }

  // Cargar usuario actual del storage
  private async loadUser() {
    const user = await this.storage.get('currentUser');
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  // Obtener valor actual del usuario
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Registrar nuevo usuario
  async register(nombre: string, email: string, password: string): Promise<boolean> {
    try {
      // Obtener usuarios existentes
      const users = await this.storage.get('users') || [];
      
      // Verificar si el email ya existe
      const existingUser = users.find((u: User) => u.email === email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Crear nuevo usuario
      const newUser: User = {
        id: Date.now().toString(),
        nombre,
        email,
        fechaRegistro: new Date(),
        numeroIntercambios: 0,
        valoracion: 5
      };

      // Guardar contraseña encriptada (simulación)
      const userWithPassword = { ...newUser, password };
      users.push(userWithPassword);

      // Guardar en storage
      await this.storage.set('users', users);

      // Auto-login después del registro
      await this.login(email, password);
      
      return true;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  // Iniciar sesión
  async login(email: string, password: string): Promise<boolean> {
    try {
      // Obtener usuarios registrados
      const users = await this.storage.get('users') || [];
      
      // Buscar usuario
      const user = users.find((u: any) => 
        u.email === email && u.password === password
      );

      if (!user) {
        throw new Error('Email o contraseña incorrectos');
      }

      // Guardar usuario actual (sin password)
      const { password: _, ...userWithoutPassword } = user;
      await this.storage.set('currentUser', userWithoutPassword);
      this.currentUserSubject.next(userWithoutPassword);

      // Navegar al dashboard
      this.router.navigate(['/tabs']);
      
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await this.storage.remove('currentUser');
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }

  // Verificar si está autenticado
  async isAuthenticated(): Promise<boolean> {
    const user = await this.storage.get('currentUser');
    return user !== null;
  }

  // Actualizar perfil de usuario
  async updateProfile(updatedData: Partial<User>): Promise<void> {
    try {
      const currentUser = this.currentUserValue;
      if (!currentUser) {
        throw new Error('No hay usuario autenticado');
      }

      const updatedUser = { ...currentUser, ...updatedData };

      // Actualizar en la lista de usuarios
      const users = await this.storage.get('users') || [];
      const userIndex = users.findIndex((u: User) => u.id === currentUser.id);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        await this.storage.set('users', users);
      }

      // Actualizar usuario actual
      await this.storage.set('currentUser', updatedUser);
      this.currentUserSubject.next(updatedUser);
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  }

  // Inicializar usuarios de prueba (solo para desarrollo)
  async initializeTestUsers(): Promise<void> {
    const users = await this.storage.get('users');
    if (!users || users.length === 0) {
      const testUsers = [
        {
          id: '1',
          nombre: 'Joana Solis',
          email: 'joana@swapi.com',
          password: '123456',
          fechaRegistro: new Date(),
          numeroIntercambios: 5,
          valoracion: 4.8,
          foto: 'https://i.pravatar.cc/150?img=1'
        },
        {
          id: '2',
          nombre: 'Juan Pérez',
          email: 'juan@swapi.com',
          password: '123456',
          fechaRegistro: new Date(),
          numeroIntercambios: 3,
          valoracion: 4.5,
          foto: 'https://i.pravatar.cc/150?img=12'
        }
      ];
      await this.storage.set('users', testUsers);
    }
  }
}