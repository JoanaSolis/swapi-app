import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { PublicationsService } from '../../services/publications';
import { Category } from '../../models';

@Component({
  selector: 'app-publicar',
  templateUrl: './publicar.page.html',
  styleUrls: ['./publicar.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PublicarPage implements OnInit {
  titulo: string = '';
  descripcion: string = '';
  tipo: 'producto' | 'servicio' = 'producto';
  categoria: string = '';
  
  productCategories: Category[] = [];
  serviceCategories: Category[] = [];
  loading: boolean = false;

  constructor(
    private publicationsService: PublicationsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.productCategories = this.publicationsService.getProductCategories();
    this.serviceCategories = this.publicationsService.getServiceCategories();
  }

  get availableCategories(): Category[] {
    return this.tipo === 'producto' ? this.productCategories : this.serviceCategories;
  }

  onTipoChange() {
    // Reset categoría cuando cambia el tipo
    this.categoria = '';
  }

  async onPublicar() {
    // Validaciones
    if (!this.titulo.trim()) {
      alert('Por favor ingresa un título');
      return;
    }

    if (!this.categoria) {
      alert('Por favor selecciona una categoría');
      return;
    }

    if (!this.descripcion.trim()) {
      alert('Por favor ingresa una descripción');
      return;
    }

    this.loading = true;
    try {
      // Crear publicación
      await this.publicationsService.createPublication({
        tipo: this.tipo,
        categoria: this.categoria,
        titulo: this.titulo,
        descripcion: this.descripcion
      });

      alert('¡Publicación creada exitosamente!');
      
      // Limpiar formulario
      this.resetForm();
      
      // Navegar a publicaciones
      this.router.navigate(['/publicaciones']);
      
    } catch (error: any) {
      console.error('Error creando publicación:', error);
      alert(error.message || 'Error al crear la publicación');
    } finally {
      this.loading = false;
    }
  }

  resetForm() {
    this.titulo = '';
    this.descripcion = '';
    this.categoria = '';
    this.tipo = 'producto';
  }

  goToTabs() {
    this.router.navigate(['/tabs']);
  }
}
