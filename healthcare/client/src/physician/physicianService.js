
import { ERROR } from "../errorHandling";
import client from "../serviceClient/apiClient";

export const getPhysician = async () => {
    return client.get('/physician').then(physician => {
        return physician;
    })
}

export const getPatients = async (physician_id) => {
    return client.get('/physician/'+physician_id+'/patients').then(patients => {
        return patients;
    })
}

export const getPatient = async (patient_id) => {
    return client.get("/physician/patients/"+patient_id).then(patient => {
        return patient;
    });
}

export const savePrescription = async (physician, patient, prescriptions) => {
    return client.post("/physician/savePrescription",
    {
        physician: physician,
        patient: patient,
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

export const getProcedures = async () => {
    return client.get("/procedure/").then(
        procedures => {
            return procedures;
        }
    )
}

export const saveVisitation = async (physician, patient, procedures) => {
    return client.post("/physician/saveVisitation",
    {
        physician: physician,
        patient: patient,
        procedures: procedures,
    }).then(response => {
        console.log("response: "+response);
        return response;
    });
}