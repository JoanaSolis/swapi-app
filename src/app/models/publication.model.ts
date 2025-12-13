export interface Publication {
  id: string;
  userId: string; // ID del usuario que publica
  userName: string; // Nombre del usuario
  userPhoto?: string;
  tipo: 'producto' | 'servicio';
  categoria: string;
  titulo: string;
  descripcion: string;
  foto?: string;
  ubicacion?: {
    lat: number;
    lng: number;
    direccion?: string;
  };
  fechaPublicacion: Date;
  activa: boolean;
}

export interface Category {
  id: string;
  nombre: string;
  tipo: 'producto' | 'servicio';
  icono?: string;
}
