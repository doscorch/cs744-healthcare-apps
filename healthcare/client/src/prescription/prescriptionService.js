import { ERROR } from "../errorHandling";
import client from "../serviceClient/apiClient";

export const getPrescription = async (prescription_id) => {
    return client.get("/prescription/"+prescription_id).then(prescription => {
        return prescription;
    });
} 