import api from "../api";
import { CriarGrupoRequest } from "./model/CriarGrupoRequest";
import { DetalheGrupoResponseDTO } from "./model/DetalheGrupoResponseDTO";
import { EditarGrupoRequest } from "./model/EditarGrupoRequest";
import { ListarGrupoTematicoDTO } from "./model/ListarGrupoTematicoDTO";

class GrupoTematicoService {
  private BASE_URL = "grupo-tematico";

  async criar(data: CriarGrupoRequest): Promise<void> {
    await api.post(`${this.BASE_URL}/criar`, data);
  }

  async listar(): Promise<ListarGrupoTematicoDTO[]> {
    const response = await api.get<ListarGrupoTematicoDTO[]>(
      `${this.BASE_URL}/listar`,
    );
    return response.data;
  }

  async pesquisar(termo: string): Promise<ListarGrupoTematicoDTO[]> {
    const response = await api.get<ListarGrupoTematicoDTO[]>(
      `${this.BASE_URL}/pesquisar`,
      {
        params: { termo },
      },
    );
    return response.data;
  }

  async participar(grupoId: number): Promise<void> {
    await api.post(`${this.BASE_URL}/${grupoId}/entrar`);
  }

  async listarMeusGrupos(): Promise<ListarGrupoTematicoDTO[]> {
    const response = await api.get<ListarGrupoTematicoDTO[]>(
      `${this.BASE_URL}/meus-grupos`,
    );
    return response.data;
  }

  async buscarDetalhes(id: number): Promise<DetalheGrupoResponseDTO> {
    const response = await api.get<DetalheGrupoResponseDTO>(
      `${this.BASE_URL}/detalhes/${id}`,
    );
    return response.data;
  }

  async editar(id: number, data: EditarGrupoRequest): Promise<void> {
    await api.put(`${this.BASE_URL}/editar/${id}`, data);
  }

  async excluir(id: number): Promise<void> {
    await api.delete(`${this.BASE_URL}/excluir/${id}`);
  }

  async favoritar(grupoId: number): Promise<void> {
  await api.post(`${this.BASE_URL}/${grupoId}/favoritos`);
}

async removerFavorito(grupoId: number): Promise<void> {
  await api.delete(`${this.BASE_URL}/${grupoId}/favoritos`);
}

async listarFavoritos(): Promise<ListarGrupoTematicoDTO[]> {
  const response = await api.get<ListarGrupoTematicoDTO[]>(
    `${this.BASE_URL}/favoritos`,
  );

  return response.data;
}
}

export default new GrupoTematicoService();
