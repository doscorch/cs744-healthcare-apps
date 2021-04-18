import { ERROR } from "../errorHandling";
import client from "../serviceClient/apiClient";

export const getPatientVisitations = async (patient) => {
    return client.get("/visitation/"+patient).then(visitations => {
        return visitations;
    });
}

export const getVisitation = async (visit) => {
    return client.get("/visitation/visit/"+visit).then(visitation => {
        return visitation;
    });
}