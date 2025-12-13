import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat';
import { AuthService } from '../../services/auth';
import { Conversation } from '../../models';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ChatPage implements OnInit {
  conversations: Conversation[] = [];
  loading: boolean = true;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    await this.loadConversations();
    
    // Inicializar datos de prueba si no hay conversaciones
    if (this.conversations.length === 0) {
      await this.chatService.initializeTestData();
      await this.loadConversations();
    }
  }

  async ionViewWillEnter() {
    // Recargar conversaciones cada vez que se entre a la página
    await this.loadConversations();
  }

  async loadConversations() {
    this.loading = true;
    try {
      this.conversations = await this.chatService.getMyConversations();
      
      // Ordenar por último mensaje (más reciente primero)
      this.conversations.sort((a, b) => {
        const dateA = a.ultimoMensajeTimestamp ? new Date(a.ultimoMensajeTimestamp).getTime() : 0;
        const dateB = b.ultimoMensajeTimestamp ? new Date(b.ultimoMensajeTimestamp).getTime() : 0;
        return dateB - dateA;
      });
    } catch (error) {
      console.error('Error cargando conversaciones:', error);
    } finally {
      this.loading = false;
    }
  }

  openConversation(conversation: Conversation) {
    this.router.navigate(['/chat-conversation', conversation.id]);
  }

  getOtherUser(conversation: Conversation) {
    const currentUser = this.authService.currentUserValue;
    return conversation.participantes.find(p => p.userId !== currentUser?.id);
  }

  goToTabs() {
    this.router.navigate(['/tabs']);
  }

  async doRefresh(event: any) {
    await this.loadConversations();
    event.target.complete();
  }
}
