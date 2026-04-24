import api from "../api";
import { AuthResponse } from "./model/AuthResponse";
import { CadastroRequest } from "./model/CadastroRequest";

class UsuarioService {
  private BASE_URL = "usuario";

  async cadastrar(data: CadastroRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      `${this.BASE_URL}/cadastro`,
      data,
    );
    return response.data;
  }
}

export default new UsuarioService();
