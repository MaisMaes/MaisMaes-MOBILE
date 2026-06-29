import { ParticipanteGrupoResumoResponseDTO } from "./ParticipanteGrupoResumoResponseDTO";

export interface DetalheGrupoResponseDTO {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  privado: boolean;
  numeroParticipantes: number;
  tempoEntreMensagens: number;
  video: boolean;
  audio: boolean;
  imagem: boolean;
  documento: boolean;
  bairros: string[];
  participantes: ParticipanteGrupoResumoResponseDTO[];
  usuarioLogadoEParticipante: boolean;
  usuarioLogadoRole: string;
  /** true quando o usuário logado possui pedido de entrada PENDENTE neste grupo */
  usuarioLogadoAguardandoAprovacao?: boolean;
}
