import { ERROR } from "../errorHandling";
import client from "../serviceClient/apiClient";

// call api to create prescription
export const createPrescription = async (prescription) => {
    return await client.post('/prescriptions', prescription).then(res => {
        return {
            msg: res.msg,
        };
    });
}

// call api to get prescriptions
export const getPrescriptions = async () => {
    return await client.get('/prescriptions').then(prescriptions => {
        return prescriptions;
    })
}
// call api to get prescriptions by order id
export const getPrescriptionsByOrderId = async (orderId) => {
    return await client.get('/prescriptions/order/' + orderId).then(prescriptions => {
        return prescriptions;
    })
}
// call api to get prescription
export const getPrescription = async (id) => {
    return await client.get('/prescriptions/' + id).then(prescription => {
        return prescription;
    })
}
// call api to patch prescription
export const patchPrescription = async (prescriptionId, prescriptionPartial) => {
    return await client.patch(`/prescriptions/${prescriptionId}`, prescriptionPartial);
}

// call api to delete prescription
export const deletePrescription = async (prescriptionId) => {
    return await client.delete(`/prescriptions/${prescriptionId}`);
}

export const sendInsuranceRequest = async (prescriptionId) => {
    return await client.post(`/insurance/request/${prescriptionId}`);
}