import api from "../api";
import { AuthResponse } from "./model/AuthResponse";
import { LoginRequest } from "./model/LoginRequest";

class AuthService {
  private BASE_URL = "auth";

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      `${this.BASE_URL}/login`,
      data,
    );
    return response.data;
  }
}

export default new AuthService();
