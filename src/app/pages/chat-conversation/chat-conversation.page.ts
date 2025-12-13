import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonContent } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../services/chat';
import { AuthService } from '../../services/auth';
import { ChatMessage, Conversation } from '../../models';

@Component({
  selector: 'app-chat-conversation',
  templateUrl: './chat-conversation.page.html',
  styleUrls: ['./chat-conversation.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ChatConversationPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  
  conversationId: string = '';
  conversation: Conversation | null = null;
  messages: ChatMessage[] = [];
  newMessage: string = '';
  loading: boolean = true;
  otherUser: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    // Obtener ID de la conversación
    this.conversationId = this.route.snapshot.paramMap.get('id') || '';
    
    if (!this.conversationId) {
      this.router.navigate(['/chat']);
      return;
    }

    await this.loadConversation();
    await this.loadMessages();
  }

  async loadConversation() {
    try {
      this.conversation = await this.chatService.getConversationById(this.conversationId);
      
      if (this.conversation) {
        // Obtener el otro usuario
        const currentUser = this.authService.currentUserValue;
        this.otherUser = this.conversation.participantes.find(p => p.userId !== currentUser?.id);
        
        // Marcar mensajes como leídos
        await this.chatService.markMessagesAsRead(this.conversationId);
      }
    } catch (error) {
      console.error('Error cargando conversación:', error);
    }
  }

  async loadMessages() {
    this.loading = true;
    try {
      this.messages = await this.chatService.getMessages(this.conversationId);
      
      // Scroll al final después de cargar mensajes
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    } finally {
      this.loading = false;
    }
  }

  async sendMessage() {
    if (!this.newMessage.trim()) {
      return;
    }

    if (!this.otherUser) {
      return;
    }

    try {
      const message = this.newMessage.trim();
      this.newMessage = ''; // Limpiar input inmediatamente
      
      await this.chatService.sendMessage(
        this.conversationId,
        this.otherUser.userId,
        message
      );
      
      // Recargar mensajes
      await this.loadMessages();
      
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('Error al enviar el mensaje');
    }
  }

  scrollToBottom() {
    this.content.scrollToBottom(300);
  }

  isMyMessage(message: ChatMessage): boolean {
    const currentUser = this.authService.currentUserValue;
    return message.senderId === currentUser?.id;
  }

  goBack() {
    this.router.navigate(['/chat']);
  }

  formatTime(timestamp: Date): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}
