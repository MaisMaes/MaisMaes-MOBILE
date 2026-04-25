export interface EditarGrupoRequest {
  titulo: string;
  descricao: string;
  categorias: string;
  bairros: string[];
  privado: boolean;
  numeroParticipantes: number;
  tempoEntreMensagens: number;
  video: boolean;
  audio: boolean;
  imagem: boolean;
  documento: boolean;
}
