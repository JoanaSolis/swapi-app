export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  mensaje: string;
  timestamp: Date;
  leido: boolean;
}

export interface Conversation {
  id: string;
  participantes: {
    userId: string;
    userName: string;
    userPhoto?: string;
  }[];
  publicationId?: string; // Si la conversación inició desde una publicación
  ultimoMensaje?: string;
  ultimoMensajeTimestamp?: Date;
  mensajesNoLeidos?: number;
}
