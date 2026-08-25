export interface ListarGrupoTematicoDTO {
  id: number;
  titulo: string;
  descricao: string;
  bairros: string[];
  banido?: boolean;
}
