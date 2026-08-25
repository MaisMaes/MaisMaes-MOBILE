export interface PedidoEntradaResponseDTO {
  pedidoId: number;
  grupoId: number;
  nomeGrupo: string;
  usuarioId: string;
  nomeUsuario: string;
  status: "PENDENTE" | "APROVADO" | "REJEITADO";
  dataPedido: string;
  dataResposta: string | null;
}
