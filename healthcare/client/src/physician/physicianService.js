
import { ERROR } from "../errorHandling";
import client from "../serviceClient/apiClient";

export const getPhysician = async () => {
    return client.get('/physician').then(physician => {
        return physician;
    })
}

export const getPatients = async () => {
    return client.get('/physician/patients').then(patients => {
        return patients;
    })
}

export const getPatient = async (patient_id) => {
    return client.get("/physician/patients/"+patient_id).then(patient => {
        return patient;
    });
}

export const savePrescription = async (physician_id, patient_id, prescriptions) => {
    return client.post("/physician/savePrescription",
    {
        physician_id: physician_id,
        patient_id: patient_id,
        prescriptions: prescriptions,
    }).then(response => {
        console.log("response: "+response);
        return response;
    });
}

export const getPatientPrescriptions = async (patient_id) => {
    return client.get("/physician/patients/"+patient_id+"/prescriptions").then(
        prescriptions => {
            return prescriptions;
        }
    )
}