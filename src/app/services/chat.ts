import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage';
import { AuthService } from './auth';
import { ChatMessage, Conversation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private conversationsSubject: BehaviorSubject<Conversation[]>;
  public conversations$: Observable<Conversation[]>;

  private messagesSubject: BehaviorSubject<ChatMessage[]>;
  public messages$: Observable<ChatMessage[]>;

  constructor(
    private storage: StorageService,
    private authService: AuthService
  ) {
    this.conversationsSubject = new BehaviorSubject<Conversation[]>([]);
    this.conversations$ = this.conversationsSubject.asObservable();

    this.messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
    this.messages$ = this.messagesSubject.asObservable();

    this.loadConversations();
  }

  // Cargar conversaciones del storage
  private async loadConversations() {
    const conversations = await this.storage.get('conversations') || [];
    this.conversationsSubject.next(conversations);
  }

  // Obtener todas las conversaciones
  private async getAllConversations(): Promise<Conversation[]> {
    return await this.storage.get('conversations') || [];
  }

  // Obtener mis conversaciones
  async getMyConversations(): Promise<Conversation[]> {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return [];

    const conversations = await this.getAllConversations();
    return conversations.filter(c => 
      c.participantes.some(p => p.userId === currentUser.id)
    );
  }

  // Obtener conversación por ID
  async getConversationById(id: string): Promise<Conversation | null> {
    const conversations = await this.getAllConversations();
    return conversations.find(c => c.id === id) || null;
  }

  // Crear o obtener conversación con un usuario
  async getOrCreateConversation(otherUserId: string, otherUserName: string, otherUserPhoto?: string, publicationId?: string): Promise<Conversation> {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      throw new Error('Debes iniciar sesión');
    }

    const conversations = await this.getAllConversations();
    
    // Buscar conversación existente
    const existing = conversations.find(c => 
      c.participantes.length === 2 &&
      c.participantes.some(p => p.userId === currentUser.id) &&
      c.participantes.some(p => p.userId === otherUserId)
    );

    if (existing) {
      return existing;
    }

    // Crear nueva conversación
    const newConversation: Conversation = {
      id: Date.now().toString(),
      participantes: [
        {
          userId: currentUser.id,
          userName: currentUser.nombre,
          userPhoto: currentUser.foto
        },
        {
          userId: otherUserId,
          userName: otherUserName,
          userPhoto: otherUserPhoto
        }
      ],
      publicationId,
      mensajesNoLeidos: 0
    };

    conversations.push(newConversation);
    await this.storage.set('conversations', conversations);
    this.conversationsSubject.next(conversations);

    return newConversation;
  }

  // Obtener mensajes de una conversación
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const allMessages = await this.storage.get('messages') || [];
    const messages = allMessages.filter((m: ChatMessage) => m.conversationId === conversationId);
    
    // Ordenar por fecha
    messages.sort((a: ChatMessage, b: ChatMessage) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    this.messagesSubject.next(messages);
    return messages;
  }

  // Enviar mensaje
  async sendMessage(conversationId: string, receiverId: string, mensaje: string): Promise<ChatMessage> {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) {
      throw new Error('Debes iniciar sesión');
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.nombre,
      receiverId,
      mensaje,
      timestamp: new Date(),
      leido: false
    };

    // Guardar mensaje
    const allMessages = await this.storage.get('messages') || [];
    allMessages.push(newMessage);
    await this.storage.set('messages', allMessages);

    // Actualizar conversación
    await this.updateConversationLastMessage(conversationId, mensaje);

    // Actualizar observable
    const messages = await this.getMessages(conversationId);
    this.messagesSubject.next(messages);

    return newMessage;
  }

  // Actualizar último mensaje de conversación
  private async updateConversationLastMessage(conversationId: string, lastMessage: string): Promise<void> {
    const conversations = await this.getAllConversations();
    const index = conversations.findIndex(c => c.id === conversationId);
    
    if (index !== -1) {
      conversations[index].ultimoMensaje = lastMessage;
      conversations[index].ultimoMensajeTimestamp = new Date();
      
      await this.storage.set('conversations', conversations);
      this.conversationsSubject.next(conversations);
    }
  }

  // Marcar mensajes como leídos
  async markMessagesAsRead(conversationId: string): Promise<void> {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;

    const allMessages = await this.storage.get('messages') || [];
    let updated = false;

    allMessages.forEach((message: ChatMessage) => {
      if (message.conversationId === conversationId && 
          message.receiverId === currentUser.id && 
          !message.leido) {
        message.leido = true;
        updated = true;
      }
    });

    if (updated) {
      await this.storage.set('messages', allMessages);
    }
  }

  // Obtener número de mensajes no leídos
  async getUnreadCount(): Promise<number> {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return 0;

    const allMessages = await this.storage.get('messages') || [];
    return allMessages.filter((m: ChatMessage) => 
      m.receiverId === currentUser.id && !m.leido
    ).length;
  }

  // Eliminar conversación
  async deleteConversation(conversationId: string): Promise<void> {
    // Eliminar conversación
    const conversations = await this.getAllConversations();
    const filtered = conversations.filter(c => c.id !== conversationId);
    await this.storage.set('conversations', filtered);
    this.conversationsSubject.next(filtered);

    // Eliminar mensajes asociados
    const allMessages = await this.storage.get('messages') || [];
    const filteredMessages = allMessages.filter((m: ChatMessage) => m.conversationId !== conversationId);
    await this.storage.set('messages', filteredMessages);
  }

  // Inicializar datos de prueba
  async initializeTestData(): Promise<void> {
    const conversations = await this.getAllConversations();
    if (conversations.length === 0) {
      // Crear conversación de ejemplo
      const testConversation: Conversation = {
        id: '1',
        participantes: [
          {
            userId: '1',
            userName: 'Joana Solis',
            userPhoto: 'https://i.pravatar.cc/150?img=1'
          },
          {
            userId: '2',
            userName: 'Juan Pérez',
            userPhoto: 'https://i.pravatar.cc/150?img=12'
          }
        ],
        publicationId: '1',
        ultimoMensaje: 'Hola vecina, si, aún la tengo!',
        ultimoMensajeTimestamp: new Date(),
        mensajesNoLeidos: 0
      };

      await this.storage.set('conversations', [testConversation]);

      // Crear mensajes de ejemplo
      const testMessages: ChatMessage[] = [
        {
          id: '1',
          conversationId: '1',
          senderId: '1',
          senderName: 'Joana Solis',
          receiverId: '2',
          mensaje: 'Buenas tardes Jano, tengo una amaca en buen estado para permutarle.',
          timestamp: new Date(Date.now() - 300000),
          leido: true
        },
        {
          id: '2',
          conversationId: '1',
          senderId: '2',
          senderName: 'Juan Pérez',
          receiverId: '1',
          mensaje: '¿Aún tienes la piscina?',
          timestamp: new Date(Date.now() - 240000),
          leido: true
        },
        {
          id: '3',
          conversationId: '1',
          senderId: '1',
          senderName: 'Joana Solis',
          receiverId: '2',
          mensaje: 'Hola vecina, si, aún la tengo!',
          timestamp: new Date(Date.now() - 180000),
          leido: true
        },
        {
          id: '4',
          conversationId: '1',
          senderId: '1',
          senderName: 'Joana Solis',
          receiverId: '2',
          mensaje: 'Quisiera venir a verla?',
          timestamp: new Date(Date.now() - 120000),
          leido: true
        },
        {
          id: '5',
          conversationId: '1',
          senderId: '2',
          senderName: 'Juan Pérez',
          receiverId: '1',
          mensaje: 'Ya pues! Tipo 6pm podría ir. Ud vive en el edificio esquina de Orindo Diaz?',
          timestamp: new Date(Date.now() - 60000),
          leido: true
        },
        {
          id: '6',
          conversationId: '1',
          senderId: '1',
          senderName: 'Joana Solis',
          receiverId: '2',
          mensaje: 'Correcto! Hablemos pronto para coordinar hasta pronto!',
          timestamp: new Date(Date.now() - 30000),
          leido: true
        },
        {
          id: '7',
          conversationId: '1',
          senderId: '2',
          senderName: 'Juan Pérez',
          receiverId: '1',
          mensaje: 'Ok, gracias',
          timestamp: new Date(),
          leido: false
        }
      ];

      await this.storage.set('messages', testMessages);
    }
  }
}