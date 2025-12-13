import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage';
import { AuthService } from './auth';
import { Publication, Category } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {
  private publicationsSubject: BehaviorSubject<Publication[]>;
  public publications$: Observable<Publication[]>;

  // Categorías de productos
  private productCategories: Category[] = [
    { id: 'hogar', nombre: 'Hogar: muebles, electrodomésticos, herramientas, jardín', tipo: 'producto' },
    { id: 'ropa', nombre: 'Ropa: zapatos, bolsos, accesorios, ropa', tipo: 'producto' },
    { id: 'juguetes', nombre: 'Juguetes: instrumentos musicales, libros', tipo: 'producto' },
    { id: 'tecnologia', nombre: 'Tecnología: dispositivos, cables, aparatos', tipo: 'producto' },
    { id: 'sostenible', nombre: 'Cambio productos sostenibles: semillas, compostaje, huerta urbana', tipo: 'producto' }
  ];

  // Categorías de servicios
  private serviceCategories: Category[] = [
    { id: 'tecnicos', nombre: 'Servicios técnicos, reparaciones', tipo: 'servicio' },
    { id: 'hogar-limpieza', nombre: 'Hogar y limpieza', tipo: 'servicio' },
    { id: 'educacion', nombre: 'Educación y clases', tipo: 'servicio' },
    { id: 'bienestar', nombre: 'Bienestar', tipo: 'servicio' },
    { id: 'creativos', nombre: 'Creativos y artísticos', tipo: 'servicio' }
  ];

  constructor(
    private storage: StorageService,
    private authService: AuthService
  ) {
    this.publicationsSubject = new BehaviorSubject<Publication[]>([]);
    this.publications$ = this.publicationsSubject.asObservable();
    this.loadPublications();
  }

  // Cargar publicaciones del storage
  private async loadPublications() {
    const publications = await this.storage.get('publications') || [];
    this.publicationsSubject.next(publications);
  }

  // Obtener todas las publicaciones
  async getPublications(): Promise<Publication[]> {
    const publications = await this.storage.get('publications') || [];
    return publications;
  }

  // Obtener publicaciones activas
  async getActivePublications(): Promise<Publication[]> {
    const publications = await this.getPublications();
    return publications.filter(p => p.activa);
  }

  // Obtener publicación por ID
  async getPublicationById(id: string): Promise<Publication | null> {
    const publications = await this.getPublications();
    return publications.find(p => p.id === id) || null;
  }

  // Obtener publicaciones por categoría
  async getPublicationsByCategory(categoria: string): Promise<Publication[]> {
    const publications = await this.getActivePublications();
    return publications.filter(p => p.categoria === categoria);
  }

  // Obtener publicaciones por tipo (producto/servicio)
  async getPublicationsByType(tipo: 'producto' | 'servicio'): Promise<Publication[]> {
    const publications = await this.getActivePublications();
    return publications.filter(p => p.tipo === tipo);
  }

  // Obtener mis publicaciones
  async getMyPublications(): Promise<Publication[]> {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return [];
    
    const publications = await this.getPublications();
    return publications.filter(p => p.userId === currentUser.id);
  }

  // Crear nueva publicación
  async createPublication(publication: Omit<Publication, 'id' | 'userId' | 'userName' | 'fechaPublicacion' | 'activa'>): Promise<Publication> {
    try {
      const currentUser = this.authService.currentUserValue;
      if (!currentUser) {
        throw new Error('Debes iniciar sesión para publicar');
      }

      const newPublication: Publication = {
        ...publication,
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.nombre,
        userPhoto: currentUser.foto,
        fechaPublicacion: new Date(),
        activa: true
      };

      const publications = await this.getPublications();
      publications.unshift(newPublication); // Agregar al inicio
      
      await this.storage.set('publications', publications);
      this.publicationsSubject.next(publications);

      return newPublication;
    } catch (error) {
      console.error('Error creando publicación:', error);
      throw error;
    }
  }

  // Actualizar publicación
  async updatePublication(id: string, updates: Partial<Publication>): Promise<void> {
    try {
      const publications = await this.getPublications();
      const index = publications.findIndex(p => p.id === id);
      
      if (index === -1) {
        throw new Error('Publicación no encontrada');
      }

      publications[index] = { ...publications[index], ...updates };
      await this.storage.set('publications', publications);
      this.publicationsSubject.next(publications);
    } catch (error) {
      console.error('Error actualizando publicación:', error);
      throw error;
    }
  }

  // Eliminar publicación
  async deletePublication(id: string): Promise<void> {
    try {
      const publications = await this.getPublications();
      const filtered = publications.filter(p => p.id !== id);
      
      await this.storage.set('publications', filtered);
      this.publicationsSubject.next(filtered);
    } catch (error) {
      console.error('Error eliminando publicación:', error);
      throw error;
    }
  }

  // Desactivar publicación (marcar como inactiva)
  async deactivatePublication(id: string): Promise<void> {
    await this.updatePublication(id, { activa: false });
  }

  // Obtener categorías de productos
  getProductCategories(): Category[] {
    return this.productCategories;
  }

  // Obtener categorías de servicios
  getServiceCategories(): Category[] {
    return this.serviceCategories;
  }

  // Obtener todas las categorías
  getAllCategories(): Category[] {
    return [...this.productCategories, ...this.serviceCategories];
  }

  // Buscar publicaciones por texto
  async searchPublications(query: string): Promise<Publication[]> {
    const publications = await this.getActivePublications();
    const lowercaseQuery = query.toLowerCase();
    
    return publications.filter(p => 
      p.titulo.toLowerCase().includes(lowercaseQuery) ||
      p.descripcion.toLowerCase().includes(lowercaseQuery) ||
      p.categoria.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Inicializar publicaciones de prueba
  async initializeTestPublications(): Promise<void> {
    const publications = await this.getPublications();
    if (publications.length === 0) {
      const testPublications: Publication[] = [
        {
          id: '1',
          userId: '1',
          userName: 'Joana Solis',
          userPhoto: 'https://i.pravatar.cc/150?img=1',
          tipo: 'producto',
          categoria: 'hogar',
          titulo: 'Piscina 3x2 x 50',
          descripcion: 'Ofrezco piscina en perfecto estado a cambio de una amaca. Sin bomba, poco uso.',
          foto: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
          fechaPublicacion: new Date(),
          activa: true
        },
        {
          id: '2',
          userId: '2',
          userName: 'Juan Pérez',
          userPhoto: 'https://i.pravatar.cc/150?img=12',
          tipo: 'servicio',
          categoria: 'bienestar',
          titulo: 'Sesiones de Reiki',
          descripcion: 'Ofrezco 6 sesiones de terapias de Reiki. Garantizo relajación, alivio y claridad mental. Te guío en tu proceso.',
          foto: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
          fechaPublicacion: new Date(),
          activa: true
        },
        {
          id: '3',
          userId: '1',
          userName: 'Joana Solis',
          userPhoto: 'https://i.pravatar.cc/150?img=1',
          tipo: 'producto',
          categoria: 'hogar',
          titulo: 'Kit de asado y jardinería',
          descripcion: 'Tula: Se ofrece Kit de asado a cambio de Kit de jardinería',
          foto: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400',
          fechaPublicacion: new Date(),
          activa: true
        }
      ];
      await this.storage.set('publications', testPublications);
      this.publicationsSubject.next(testPublications);
    }
  }
}