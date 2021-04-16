const express = require('express');
const { request } = require('../app');
const router = express.Router();
const _prescriptionService = require('../services/prescriptions-service');

/*
{ physician:
   { user_id: 8,
     username: 'mWhite3',
     first_name: 'Meg',
     last_name: 'White',
     user_type: 3,
     user_status: 1,
     license_number: '152352',
     physician_state: 'MI' },
  patient:
   { user_id: 10,
     username: 'goSpidey123',
     first_name: 'Peter',
     last_name: 'Parker',
     user_type: 2,
     user_status: 1,
     date_of_birth: '1982-03-27T00:00:00.000Z',
     address: '746 23rd Ave. New York City, NY' },
  prescriptions:
   [ { prescription: 'Hydroxezine 10mg tablets',
       dosage: 'Twice daily',
       quantity: '30',
       refill: '2',
       tableData: [Object] },
     { prescription: 'Amoxicillin 50mg capsules',
       dosage: 'Once daily',
       quantity: '50',
       refill: '1',
       tableData: [Object] } ],
  date: 2021-04-09T17:16:31.194Z,
  prescription_id: 8,
  patient_id: NaN }
*/

// post prescription
router.post('/recieve/prescription', async function (req, res) {
    if (!req.body) {
        res.status('400').send();
        return;
    }

    if (!req.body.patient) {
        res.status('400').send(new Error('missing patient'));
        return;
    }
    if (!req.body.physician) {
        res.status('400').send(new Error('missing physician'));
        return;
    }

    const patient_first_name = req.body.patient.first_name;
    if (!patient_first_name) {
        res.status('400').send(new Error('missing patient first name'));
        return;
    }
    const patient_last_name = req.body.patient.last_name;
    if (!patient_last_name) {
        res.status('400').send(new Error('missing patient last name'));
        return;
    }
    const patient_address = req.body.patient.address;
    if (!patient_address) {
        res.status('400').send(new Error('missing patient address'));
        return;
    }
    const patient_date_of_birth = req.body.patient.date_of_birth;
    if (!patient_date_of_birth) {
        res.status('400').send(new Error('missing patient date of birth'));
        return;
    }

    const physician_first_name = req.body.physician.first_name;
    if (!physician_first_name) {
        res.status('400').send(new Error('missing physician first name'));
        return;
    }
    const physician_last_name = req.body.physician.last_name;
    if (!physician_last_name) {
        res.status('400').send(new Error('missing physician last name'));
        return;
    }
    const physician_license_number = req.body.physician.license_number;
    if (!physician_license_number) {
        res.status('400').send(new Error('missing physician license number'));
        return;
    }
    const physician_institution = "Peach Healthcare"

    const order_date = req.body.date;
    if (!order_date) {
        res.status('400').send(new Error('missing date'));
        return;
    }
    const prescriptions = req.body.prescriptions;
    if (!prescriptions) {
        res.status('400').send(new Error('missing prescriptions'));
        return;
    }

    for (let i = 0; i < prescriptions.length; i++) {
        const p = prescriptions[i];
        const prescription = p.prescription;
        const dosage = p.dosage;
        const quantity = Number(p.quantity);
        const refill = Number(p.refill);

        if (prescription && dosage && !isNaN(quantity) && !isNaN(refill)) {
            const order = {
                patient_first_name,
                patient_last_name,
                patient_address,
                patient_date_of_birth,
                physician_first_name,
                physician_last_name,
                physician_institution,
                physician_license_number,
                prescription,
                dosage,
                quantity,
                refill,
                order_date,
                order_status: 0
            }
            console.log(order);

            await _prescriptionService.createPrescription(order, function (err, prescription) {
                if (err) {
                    console.log(err);
                    res.status('500').send();
                    return;
                }
            });
        }
    }

    res.sendStatus(200);
    return;
});

module.exports = router;
