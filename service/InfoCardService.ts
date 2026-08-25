import api from "../api";

export interface InfoCard {
  id: string;
  titulo: string;
  descricao: string;
  imagem?: string | null;
  link?: string | null;
  destaque: boolean;
  ativo: boolean;
  dataCriacao: string;
}

interface PageResponse<T> {
  content: T[];
}

class InfoCardService {
  async listar(): Promise<InfoCard[]> {
    const response = await api.get<PageResponse<InfoCard>>("/infocards");
    return response.data.content;
  }

  async buscarPorTitulo(titulo: string): Promise<InfoCard[]> {
    const response = await api.get<PageResponse<InfoCard>>(
      "/infocards/buscar",
      {
        params: { titulo },
      },
    );

    return response.data.content;
  }

  async buscarPorId(id: string): Promise<InfoCard> {
    const response = await api.get<InfoCard>(`/infocards/${id}`);
    return response.data;
  }

  async listarDestaques(): Promise<InfoCard[]> {
    const response = await api.get<PageResponse<InfoCard>>(
      "/infocards/destaques",
    );
    return response.data.content ?? [];
  }

  //   async buscarPorId(id: string): Promise<InfoCard> {
  //   const response = await api.get(`/infocard/${id}`);
  //   return response.data;
  // }
}

export default new InfoCardService();
