import api from "../api";
import { AuthResponse } from "./model/AuthResponse";
import { CadastroRequest } from "./model/CadastroRequest";

type UsuarioMe = {
  nome: string;
  email: string;
  telefone: string;
};

class UsuarioService {
  private BASE_URL = "usuario";

  async me(): Promise<UsuarioMe> {
    const response = await api.get<UsuarioMe>(`${this.BASE_URL}/me`);
    return response.data;
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
