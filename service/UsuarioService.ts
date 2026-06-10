import api from "../api";
import { AuthResponse } from "./model/AuthResponse";
import { CadastroRequest } from "./model/CadastroRequest";

export type UsuarioMe = {
  nome: string;
  email: string;
  telefone: string;
};

export type AtualizarUsuarioRequest = {
  nome?: string;
  email?: string;
  telefone?: string;
  senha?: string;
};

class UsuarioService {
  private BASE_URL = "usuario";

  async me(): Promise<UsuarioMe> {
    const response = await api.get<UsuarioMe>(`${this.BASE_URL}/me`);
    return response.data;
  }

  async atualizar(data: AtualizarUsuarioRequest): Promise<void> {
    await api.patch(`${this.BASE_URL}/atualizar`, data);
  }

  async cadastrar(data: CadastroRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      `${this.BASE_URL}/cadastro`,
      data,
    );
    return response.data;
  }
}

export default new UsuarioService();
