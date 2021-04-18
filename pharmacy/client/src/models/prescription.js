const Prescription_Ready = 0;
const Prescription_Verified_Patient = 1;
const Prescription_Verified_Physician = 2;
const Prescription_Filled = 3;
const Prescription_Pending_Insurance = 4;
const Prescription_Processed = 5;

export const PrescriptionStatus = {
    Ready: Prescription_Ready,
    Verified_Patient: Prescription_Verified_Patient,
    Verified_Physician: Prescription_Verified_Physician,
    Filled: Prescription_Filled,
    Pending_Insurance: Prescription_Pending_Insurance,
    Processed: Prescription_Processed,

    GetTranslation: (type) => {
        switch (type) {
            case Prescription_Ready: return "Waiting on Patient Verification";
            case Prescription_Verified_Patient: return "Waiting on Physcian Verification";
            case Prescription_Verified_Physician: return "Waiting on Prescription to be Filled";
            case Prescription_Filled: return "Waiting on Sending Insurance Request";
            case Prescription_Pending_Insurance: return "Waiting on Insurance System";
            case Prescription_Processed: return "Processed";
        }
    }
};
