import { useMutation } from "@tanstack/react-query";
import { uploadImageForOcr, OcrResult } from "@/services/ocrService";

export const useOcr = () => {
    return useMutation<OcrResult, Error, File>({
        mutationFn: (file: File) => uploadImageForOcr(file)
    })
}

