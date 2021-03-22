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
        age_limit,
        max_coverage_per_year,
        percent_coverage,
        premium_per_month,

        selectedDrugIds,
    };

    return client.post('/policy/createPolicy', args).then(res => {
        return {
            data: res.data
        };
    });
}

export const updatePolicy = async (policy_id, code, policy_name, age_limit, max_coverage_per_year, percent_coverage, premium_per_month, selectedDrugIds) => {
    let args = {
        policy_id,
        code,
        policy_name,
        age_limit,
        max_coverage_per_year,
        percent_coverage,
        premium_per_month,

        selectedDrugIds,
    };

    return client.post('/policy/updatePolicy', args).then(res => {
        return {
            data: res.data
        };
    });
}