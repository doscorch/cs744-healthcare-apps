
import { ERROR } from "../errorHandling";
import client from "../serviceClient/apiClient";

// call api to create physician
export const createPhysician = async (physician) => {
    return await client.post('/physicians', physician).then(res => {
        return {
            msg: res.msg,
        };
    });
}

// call api to get physicians
export const getPhysicians = async () => {
    return await client.get('/physicians').then(physicians => {
        return physicians;
    })
}
// call api to patch physician
export const patchPhysician = async (physicianId, physicianPartial) => {
    return await client.patch(`/physicians/${physicianId}`, physicianPartial);
}

// call api to delete physician
export const deletePhysician = async (physicianId) => {
    return await client.delete(`/physicians/${physicianId}`);
}