const express = require('express');
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
router.post('/prescription-order', function (req, res) {
    if (!req.body) {
        res.status('400').send();
        return;
    }

    _prescriptionService.createPrescription(req.body, function (err, prescription) {
        if (err) {
            console.log(err);
            res.status('500').send();
            return;
        }

        res.send(prescription);
        return;
    });
});

module.exports = router;
