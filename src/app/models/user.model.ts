export interface User {
  id: string;
  nombre: string;
  email: string;
  password?: string; // Opcional, no se guarda en el storage
  foto?: string;
  ubicacion?: {
    lat: number;
    lng: number;
    direccion?: string;
  };
  valoracion?: number; // Promedio de 1-5
  numeroIntercambios?: number;
  fechaRegistro: Date;
}
