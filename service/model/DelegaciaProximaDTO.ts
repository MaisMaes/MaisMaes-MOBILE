export interface DelegaciaProximaDTO {
  id: number;
  nome: string;
  endereco?: string | null;
  telefone?: string | null;
  latitude: number;
  longitude: number;
  distanciaKm: number;
}
