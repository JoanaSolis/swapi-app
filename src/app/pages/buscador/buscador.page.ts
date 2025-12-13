import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { PublicationsService } from '../../services/publications';
import { Category, Publication } from '../../models';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.page.html',
  styleUrls: ['./buscador.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class BuscadorPage implements OnInit {
  selectedType: 'producto' | 'servicio' = 'producto';
  productCategories: Category[] = [];
  serviceCategories: Category[] = [];
  searchResults: Publication[] = [];
  showResults: boolean = false;
  loading: boolean = false;

  constructor(
    private publicationsService: PublicationsService,
    private router: Router
  ) { }

  ngOnInit() {
    // Cargar categorías
    this.productCategories = this.publicationsService.getProductCategories();
    this.serviceCategories = this.publicationsService.getServiceCategories();
  }

  selectType(type: 'producto' | 'servicio') {
    this.selectedType = type;
    this.showResults = false;
    this.searchResults = [];
  }

  async searchByCategory(categoria: string) {
    this.loading = true;
    this.showResults = true;
    
    try {
      // Buscar publicaciones por categoría
      const results = await this.publicationsService.getPublicationsByCategory(categoria);
      this.searchResults = results;
    } catch (error) {
      console.error('Error buscando publicaciones:', error);
      alert('Error al buscar publicaciones');
    } finally {
      this.loading = false;
    }
  }

  goToTabs() {
    this.router.navigate(['/tabs']);
  }

  goToPublication(id: string) {
    // Navegar a detalles de publicación (o abrir chat)
    this.router.navigate(['/publicaciones']);
  }
}
