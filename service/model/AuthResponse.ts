export interface AuthResponse {
  token: string;
  status: PerfilStatus;
}

export enum PerfilStatus {
  DESATIVADO = "DESATIVADO",
  BANIDO = "BANIDO",
  ATIVADO = "ATIVADO"
}
