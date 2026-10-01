import * as ImagePicker from "expo-image-picker";

export type ResultadoFacial =
  | { status: "cancelado" }
  | { status: "sem_rosto" }
  | { status: "multiplos_rostos" }
  | { status: "ok"; genero: "Female" | "Male" };

type FacePlusPlusResponse = {
  faces?: { attributes?: { gender?: { value: "Female" | "Male" } } }[];
  error_message?: string;
};

class FaceService {
  private URL = "https://api-us.faceplusplus.com/facepp/v3/detect";
  // EXPO_PUBLIC_ vars are bundled into the app; acceptable only for academic use.
  private API_KEY = process.env.EXPO_PUBLIC_FACEPP_KEY;
  private API_SECRET = process.env.EXPO_PUBLIC_FACEPP_SECRET;

  async verificarRosto(): Promise<ResultadoFacial> {
    if (!this.API_KEY || !this.API_SECRET) {
      throw new Error("Chaves da Face++ não configuradas no arquivo .env.");
    }

    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      throw new Error("Permita o acesso à câmera para concluir o cadastro.");
    }

    const foto = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      quality: 0.5,
      base64: true,
    });
    const base64 = foto.canceled ? undefined : foto.assets[0]?.base64;
    if (!base64) return { status: "cancelado" };

    const form = new FormData();
    form.append("api_key", this.API_KEY);
    form.append("api_secret", this.API_SECRET);
    form.append("image_base64", base64);
    form.append("return_attributes", "gender");

    let data: FacePlusPlusResponse;
    try {
      const response = await fetch(this.URL, { method: "POST", body: form });
      data = await response.json();
    } catch {
      throw new Error(
        "Não foi possível conectar ao serviço de verificação facial.",
      );
    }

    if (data.error_message) {
      if (data.error_message.startsWith("CONCURRENCY_LIMIT_EXCEEDED")) {
        throw new Error("Serviço de verificação ocupado. Tente novamente.");
      }
      throw new Error(`Falha na verificação facial (${data.error_message}).`);
    }

    const faces = data.faces ?? [];
    if (faces.length === 0) return { status: "sem_rosto" };
    if (faces.length > 1) return { status: "multiplos_rostos" };

    const genero = faces[0].attributes?.gender?.value;
    if (!genero) return { status: "sem_rosto" };

    return { status: "ok", genero };
  }
}

export default new FaceService();
