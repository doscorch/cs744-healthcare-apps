import { ERROR } from "../errorHandling";
import client from "../serviceClient/apiClient";

/**
 * Gets all policies
 */
 export const getAllPolicies = async () => {
    return client.get('/policy/getAllPolicies').then(res => {
        return {
            data: res.data
        };
    });
}

/**
 * Gets drugs of a policy
 */
 export const getDrugsFromPolicyId = async (policy_id) => {
    return client.get('/policy/getDrugs/' + policy_id).then(res => {
        return {
            data: res.data
        };
    });
}

/**
 * Gets all drugs
 */
 export const getAllDrugs = async () => {
    return client.get('/policy/getAllDrugs').then(res => {
        return {
            data: res.data
        };
    });
}

/**
 * Create policy
 */
 export const createPolicy = async (code, policy_name, age_limit, max_coverage_per_year, percent_coverage, premium_per_month, selectedDrugIds) => {
    let args = {
        code,
        policy_name,
        age_limit: Number(age_limit),
        max_coverage_per_year: Number(max_coverage_per_year),
        percent_coverage: Number(percent_coverage),
        premium_per_month: Number(premium_per_month),

        selectedDrugIds,
        policy_status: 1,
    };

    return client.post('/policy/createPolicy', args).then(res => {
        return {
            data: res.data
        };
    });
}

export const updatePolicy = async (policy_id, code, policy_name, age_limit, max_coverage_per_year, percent_coverage, premium_per_month, policy_status, selectedDrugIds) => {
    let args = {
        policy_id,
        code,
        policy_name,
        age_limit,
        max_coverage_per_year,
        percent_coverage,
        premium_per_month,
        policy_status,

        selectedDrugIds,
    };

    return client.post('/policy/updatePolicy', args).then(res => {
        return {
            data: res.data
        };
    });
}


export const getPolicyHoldersWithPolicy = async(policy_id) => {
    let args = {policy_id};
    return client.post('/policy/getPolicyHoldersWithPolicy', args).then(res => {
        return {
            data: res.data
        };
    });
}

export const getPolicyByPatient = async(payload) => {
    return client.post('/policy/getPolicyByPatient', payload).then(res => {
        return {
            data: res.data
        };
    });
}

