import { ERROR } from "../errorHandling";
import client from "../serviceClient/apiClient";

/**
 * Gets all policies
 */
 export const getAllRequests = async () => {
    return client.get('/request/getAllRequests').then(res => {
        return {
            data: res.data
        };
    });
}

export const getDrug = async (drug_id) => {
    return client.get('/request/getDrug/' + drug_id).then(res => {
        return {
            data: res.data
        };
    });
}

export const requestAction = async (request_id, request_status) => {
    let args = {request_id, request_status};
    return client.post('/request/requestAction', args).then(res => {
        return {
            data: res.data
        };
    });
}

export const applyTransaction = async (request) => {
    return client.post('/request/applyTransaction', request).then(res => {
        return {
            data: res.data
        };
    });
}


