import { ERROR } from "../errorHandling";
import client from "../serviceClient/apiClient";

/**
 * Gets all policies
 */
 export const getAllPolicyHolders = async () => {
    return client.get('/policyHolder/getAllPolicyHolders').then(res => {
        return {
            data: res.data
        };
    });
}

export const createPolicyHolder = async (
    first_name,
last_name,
date_of_birth,
address,
policy_id,
start_date,
end_date,
amount_paid,
amount_remaining) => {
    let args = {
        first_name,
        last_name,
        date_of_birth,
        address,
        policy_id,
        start_date,

        end_date,
        amount_paid,
        amount_remaining
    };

    return client.post('/policyHolder/createPolicyHolder', args).then(res => {
        return {
            data: res.data
        };
    });
}

export const updatePolicyHolder = async (
    policy_holder_id,
    first_name,
    last_name,
    date_of_birth,
    address,
    policy_id,
    start_date,
    end_date,
    amount_paid,
    amount_remaining,
    policy_holder_status) => {

    let args = {
        policy_holder_id,
        first_name,
        last_name,
        date_of_birth,
        address,
        policy_id,
        start_date,

        end_date,
        amount_paid,
        amount_remaining,

        policy_holder_status
    };

    return client.post('/policyHolder/updatePolicyHolder', args).then(res => {
        return {
            data: res.data
        };
    });
}

export const getTransactions = async (policy_holder_id) => {

    return client.get('/policyHolder/getTransactions/' + policy_holder_id).then(res => {
        return {
            data: res.data
        };
    });
}
