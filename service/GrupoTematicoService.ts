import api from "../api";
import { CriarGrupoRequest } from "./model/CriarGrupoRequest";
import { DetalheGrupoResponseDTO } from "./model/DetalheGrupoResponseDTO";
import { EditarGrupoRequest } from "./model/EditarGrupoRequest";
import { ListarGrupoTematicoDTO } from "./model/ListarGrupoTematicoDTO";
import { MembroStatusResponseDTO } from "./model/MembroStatusResponseDTO";
import { PedidoEntradaResponseDTO } from "./model/PedidoEntradaResponseDTO";

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

  async participar(grupoId: number): Promise<string> {
    const response = await api.post<string>(`${this.BASE_URL}/${grupoId}/entrar`);
    return response.data;
  }

  async listarPedidosEntrada(grupoId: number): Promise<PedidoEntradaResponseDTO[]> {
    const response = await api.get<PedidoEntradaResponseDTO[]>(
      `${this.BASE_URL}/${grupoId}/pedidos-entrada`,
    );
    return response.data;
  }

  async responderPedidoEntrada(
    grupoId: number,
    pedidoId: number,
    aprovado: boolean,
  ): Promise<PedidoEntradaResponseDTO> {
    const response = await api.patch<PedidoEntradaResponseDTO>(
      `${this.BASE_URL}/${grupoId}/pedidos-entrada/${pedidoId}`,
      { aprovado },
    );
    return response.data;
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

  async verificarParticipacao(id: number): Promise<MembroStatusResponseDTO> {
    const response = await api.get<MembroStatusResponseDTO>(
      `${this.BASE_URL}/${id}/sou-participante`,
    );
    return response.data;
  }

  async denunciar(grupoId: number, descricao: string): Promise<void> {
    await api.post(`${this.BASE_URL}/denunciar/${grupoId}`, {
      descricao,
    });
  } 
}

export default new GrupoTematicoService();
