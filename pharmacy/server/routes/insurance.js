const express = require('express');
const router = express.Router();
const _prescriptionService = require('../services/prescriptions-service');
const _patientService = require('../services/patients-service');
const _physicianService = require('../services/physicians-service');
const _medicineService = require('../services/medicines-service');

router.post('/request/:prescriptionId', function (req, res) {
  if (!req.params.prescriptionId) {
    res.status('400').send();
    return;
  }

  _prescriptionService.getPrescription(req.params.prescriptionId, (err, prescription) => {
    if (prescription.medicine_id == -1 || prescription.physician_id == -1 || prescription.patient_id == -1) {
      res.status('400').send();
      return;
    }
    _patientService.getPatient(prescription.patient_id, (err, patient) => {
      _physicianService.getPhysician(prescription.physician_id, (err, physician) => {
        _medicineService.getMedicine(prescription.medicine_id, (err, medicine) => {
          const payload = {
            prescription,
            verified_patient: patient,
            verified_physician: physician,
            medicine
          }

          console.log(payload);
          res.status("200").send();
          return;
        })
      })
    })
  })
});

module.exports = router;
