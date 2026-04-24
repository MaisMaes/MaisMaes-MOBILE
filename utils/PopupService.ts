import Toast from "react-native-toast-message";

const PopupService = {
    error: (message: string) => {
        Toast.show({
            type: "error",
            text1: "Erro",
            text2: message,
        });
    },
    success: (message: string) => {
        Toast.show({
            type: "success",
            text1: "Sucesso",
            text2: message,
        });
    },
    info: (message: string) => {
        Toast.show({
            type: "info",
            text1: "Informação",
            text2: message,
        });
    }
}

export default PopupService;