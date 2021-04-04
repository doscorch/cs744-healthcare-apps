import { ERROR } from "../errorHandling";
import client from "../serviceClient/apiClient";

export const getPrescription = async (prescription_id, prescription_med_id) => {
    return client.get("/prescription/"+prescription_id+"/medicine/"+prescription_med_id).then(prescription => {
        return prescription;
    });
} 