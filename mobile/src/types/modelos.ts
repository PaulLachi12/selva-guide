// Tipos centrales de la app. Los archivos nuevos en TypeScript los importan desde aquí;
// cuando exista el backend tipado, estos tipos deben coincidir con sus respuestas.

export type Categoria =
  | 'turistico'
  | 'gastronomico'
  | 'deportivo'
  | 'recreativo'
  | 'transporte'
  | 'servicios';

export interface Resena {
  id: number;
  autor: string;
  rating: number;
  comentario: string;
  fecha: string;
}

export interface Punto {
  id: number | string;
  nombre: string;
  categoria: Categoria;
  subcategoria?: string;
  calle?: string;
  direccion?: string;
  lat: number;
  lng: number;
  distancia?: string;
  acceso?: string;
  costo?: string;
  dificultad?: string;
  horario?: string;
  telefono?: string;
  descripcionCorta?: string;
  descripcionLarga?: string;
  recomendaciones?: string;
  audio?: string;
  tieneAudioGuia?: boolean;
  tarifaDesdePlaza?: string;
  tarifaBaseS?: number;
  rating?: number;
  resenas?: Resena[];
  /** true si coordenadas, horario o precio son aproximados y deben verificarse en campo */
  verificar?: boolean;
}

export interface Coordenada {
  latitude: number;
  longitude: number;
}

/** Paso de una ruta, construido a partir de los steps de OSRM (ver src/services/navegacion.js). */
export interface PasoRuta {
  tipo: string;
  modificador: string;
  nombre: string;
  distancia: number;
  lat?: number;
  lng?: number;
}

export interface Ruta {
  coords: Coordenada[];
  distancia: number;
  duracion: number;
  pasos?: PasoRuta[];
}

export interface TarifaMototaxi {
  min: number;
  max: number;
  tramo: string;
  tramoKey: 'corto' | 'medio' | 'largo';
  nocturno: boolean;
  etiqueta: string;
  etiquetaUsd: string;
  etiquetaCompleta: string;
}
