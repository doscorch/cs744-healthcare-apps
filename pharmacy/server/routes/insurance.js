const express = require('express');
const fetch = require("node-fetch");
const router = express.Router();
const _prescriptionService = require('../services/prescriptions-service');
const _patientService = require('../services/patients-service');
const _physicianService = require('../services/physicians-service');
const _medicineService = require('../services/medicines-service');

// const insuranceURL = "http://localhost:5001";
// const insuranceGetPolicyPath = "/insurance/test";

const insuranceURL = "http://localhost:5002";
const insuranceGetPolicyPath = "/policy/getPolicyByPatientPharmacy";

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

          fetch(`${insuranceURL}${insuranceGetPolicyPath}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          })
            .then(response => response.json())
            .then(result => {
              console.log('Success:', result);
              let patch = { order_status: 4 };
              _prescriptionService.patchPrescription(prescription.prescription_id, patch, (err, prescription) => {
                if (err) {
                  console.log(err);
                  res.status('500').send();
                  return;
                }

                res.sendStatus(200);
                return;
              })
            })
            .catch(error => {
              console.error('Error:', error);
              res.status("500").send();
              return;
            });
        })
      })
    })
  })
});

router.post('/receive/policy', function (req, res) {
  if (!req.body) {
    res.status('400').send();
    return;
  }

  if (!req.body.prescription_id) {
    res.status('400').send(new Error('missing prescription id'));
    return;
  }

  let coverage = 0;
  if (req.body.is_approved && req.body.policy) {
    coverage = req.body.policy.percent_coverage;
  }

  _prescriptionService.patchPrescription(req.body.prescription_id, { order_status: 5, insurance_coverage: coverage }, (err, prescription) => {
    if (err) {
      console.log(err);
      res.status('500').send();
      return;
    }

    res.sendStatus(200);
    return;
  })
});

router.post('/test', function (req, res) {
  if (!req.body) {
    res.status('400').send();
    return;
  }

  const response =
  {
    covered_medicine: true,
    medicines: [{}],
    policy: {

    }
  }
  res.send(response);
  return;
});
module.exports = router;
