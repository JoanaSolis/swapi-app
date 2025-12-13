import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly STORAGE_KEY = 'swapi_';

  constructor() { }

  // Guardar datos en localStorage
  async set(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(this.STORAGE_KEY + key, jsonValue);
    } catch (error) {
      console.error('Error guardando en storage:', error);
      throw error;
    }
  }

  // Obtener datos de localStorage
  async get(key: string): Promise<any> {
    try {
      const item = localStorage.getItem(this.STORAGE_KEY + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error obteniendo de storage:', error);
      return null;
    }
  }

  // Eliminar un item específico
  async remove(key: string): Promise<void> {
    try {
      localStorage.removeItem(this.STORAGE_KEY + key);
    } catch (error) {
      console.error('Error eliminando de storage:', error);
      throw error;
    }
  }

  // Limpiar todo el storage de la app
  async clear(): Promise<void> {
    try {
      // Obtener todas las keys
      const keys = Object.keys(localStorage);
      // Filtrar solo las de nuestra app
      const appKeys = keys.filter(key => key.startsWith(this.STORAGE_KEY));
      // Eliminar cada una
      appKeys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error limpiando storage:', error);
      throw error;
    }
  }

  // Obtener todas las keys de la app
  async keys(): Promise<string[]> {
    try {
      const keys = Object.keys(localStorage);
      return keys
        .filter(key => key.startsWith(this.STORAGE_KEY))
        .map(key => key.replace(this.STORAGE_KEY, ''));
    } catch (error) {
      console.error('Error obteniendo keys:', error);
      return [];
    }
  }
}