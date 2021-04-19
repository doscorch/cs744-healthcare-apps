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

export const getAllRequestsHC = async () => {
    return client.get('/request/getAllRequestsHC').then(res => {
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

export const getProcedure = async (procedure_id) => {
    return client.get('/request/getProcedure/' + procedure_id).then(res => {
        return {
            data: res.data
        };
    });
}

export const requestAction = async (request) => {
    return client.post('/request/requestAction', request).then(res => {
        return {
            data: res.data
        };
    });
}

export const requestActionHC = async (request) => {
    return client.post('/request/requestActionHC', request).then(res => {
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

export const applyTransactionHC = async (request) => {
    return client.post('/request/applyTransactionHC', request).then(res => {
        return {
            data: res.data
        };
    });
}

