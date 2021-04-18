const { DataTypes } = require('sequelize');
const sequelize = require('../../db');

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
const Prescription = sequelize.define('Prescription', {
    prescription_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    patient_first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patient_last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patient_date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false
    },
    patient_address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    physician_first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    physician_last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    physician_institution: {
        type: DataTypes.STRING,
        allowNull: false
    },
    physician_license_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    prescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dosage: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    refill: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    order_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    order_status: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    physician_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    medicine_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    insurance_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    timestamps: false,
    tableName: 'prescriptions'
});

module.exports = Prescription;