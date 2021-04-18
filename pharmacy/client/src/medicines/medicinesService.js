import { ERROR } from "../errorHandling";
import client from "../serviceClient/apiClient";

// call api to create medicine
export const createMedicine = async (medicine) => {
    return await client.post('/medicines', medicine).then(res => {
        return {
            msg: res.msg,
        };
    });
}

// call api to get medicines
export const getMedicines = async () => {
    return await client.get('/medicines').then(medicines => {
        return medicines;
    })
}

// call api to get medicine
export const getMedicine = async (medicineId) => {
    return await client.get(`/medicines/${medicineId}`).then(medicine => {
        return medicine;
    })
}

// call api to patch medicine
export const patchMedicine = async (medicineId, medicinePartial) => {
    return await client.patch(`/medicines/${medicineId}`, medicinePartial);
}

// call api to delete medicine
export const deleteMedicine = async (medicineId) => {
    return await client.delete(`/medicines/${medicineId}`);
}
