import { ERROR } from "../errorHandling";
import client from "../serviceClient/apiClient";

// call api to create patient
export const createPatient = async (patient) => {
    return await client.post('/patients', patient).then(res => {
        return {
            msg: res.msg,
        };
    });
}

// call api to get patients
export const getPatients = async () => {
    return await client.get('/patients').then(patients => {
        return patients;
    })
}
// call api to patch patient
export const patchPatient = async (patientId, patientPartial) => {
    return await client.patch(`/patients/${patientId}`, patientPartial);
}

// call api to delete patient
export const deletePatient = async (patientId) => {
    return await client.delete(`/patients/${patientId}`);
}
