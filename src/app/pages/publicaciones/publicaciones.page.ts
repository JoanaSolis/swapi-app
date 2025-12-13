import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { PublicationsService } from '../../services/publications';
import { ChatService } from '../../services/chat';
import { Publication } from '../../models';

@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicaciones.page.html',
  styleUrls: ['./publicaciones.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PublicacionesPage implements OnInit {
  publications: Publication[] = [];
  loading: boolean = true;

  constructor(
    private publicationsService: PublicationsService,
    private chatService: ChatService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.loadPublications();
    
    // Inicializar datos de prueba si no hay publicaciones
    if (this.publications.length === 0) {
      await this.publicationsService.initializeTestPublications();
      await this.loadPublications();
    }
  }

  async loadPublications() {
    this.loading = true;
    try {
      this.publications = await this.publicationsService.getActivePublications();
    } catch (error) {
      console.error('Error cargando publicaciones:', error);
    } finally {
      this.loading = false;
    }
  }

  async openChat(publication: Publication) {
    try {
      // Crear o obtener conversación con el dueño de la publicación
      const conversation = await this.chatService.getOrCreateConversation(
        publication.userId,
        publication.userName,
        publication.userPhoto,
        publication.id
      );
      
      // Navegar al chat
      this.router.navigate(['/chat-conversation', conversation.id]);
    } catch (error) {
      console.error('Error abriendo chat:', error);
      alert('Error al abrir el chat');
    }
  }

  goToTabs() {
    this.router.navigate(['/tabs']);
  }

  async doRefresh(event: any) {
    await this.loadPublications();
    event.target.complete();
  }
}
