import api from "../api";
import { DelegaciaProximaDTO } from "./model/DelegaciaProximaDTO";

class DelegaciaService {
  private BASE_URL = "delegacias";

  async listarProximas(
    lat: number,
    lon: number,
    raioKm = 20,
    limite = 3,
  ): Promise<DelegaciaProximaDTO[]> {
    const response = await api.get<DelegaciaProximaDTO[]>(
      `${this.BASE_URL}/proximas`,
      { params: { lat, lon, raioKm, limite } },
    );
    return response.data;
  }
}

export default new DelegaciaService();
