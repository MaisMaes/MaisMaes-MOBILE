import api from "../api";
import { AuthResponse } from "./model/AuthResponse";
import { LoginRequest } from "./model/LoginRequest";
import { RecuperaSenhaRequest } from "./model/RecuperaSenhaRequest";
import { RedefineSenhaRequest } from "./model/RedefineSenhaRequest";

class AuthService {
  private BASE_URL = "auth";

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      `${this.BASE_URL}/login`,
      data,
    );
    return response.data;
  }

  async recuperarSenha(request: RecuperaSenhaRequest): Promise<void> {
    await api.post(`${this.BASE_URL}/recuperar-senha`, request);
  }

  async redefinirSenha(request: RedefineSenhaRequest): Promise<void> {
    await api.post(`${this.BASE_URL}/redefinir-senha`, request);
  }
}

export default new AuthService();
