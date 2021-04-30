import * as React from 'react';
import MaterialTable from 'material-table';
import { Select, MenuItem } from '@material-ui/core'
import { getUsers, patchUser } from '../auth/usersService';
import { getPatientPrescriptions } from '../physician/physicianService';
import { UserType, UserStatus } from '../models/user';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';

export default class PatientPrescriptions extends React.Component {
    state = {
        prescriptions: []
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        return getPatientPrescriptions(this.props.match.params.patient)
            .then(prescriptions => {
                this.setState({ prescriptions: prescriptions })
            });
    }

    render() {
        const tableRef = React.createRef();
        return (
            <div>
                <MaterialTable
                    tableRef={tableRef}
                    options={{
                        sorting: true,
                        search: true,
                        paging: false,
                    }}
                    title="Patient Prescriptions"
                    actions={
                        [
                            {
                                icon: 'file_copy',
                                tooltip: 'View Prescription',
                                onClick: (event, row) => {
                                    const prescription_id = row.prescription_id;
                                    const prescription_med_id = row.prescription_medicine_id;
                                    this.props.history.push("/prescriptions/"+prescription_id);
                                }
                            },

                        ]
                    }
                    columns={[
                        // { title: 'Id', field: '_id' },
                        { title: 'Patient Name', render: (entry) => { return entry.patient_first_name + " " + entry.patient_last_name}, validate: p => p.patient_first_name == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Physician Name', render: (entry) => { return entry.physician_first_name + " " + entry.physician_last_name}, validate: p => p.patient_last_name == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Prescription', field: 'prescription', validate: p => p.prescription == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Dosage', field: 'dosage', validate: p => p.dosage == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Quantity', field: 'quantity', validate: p => p.quantity == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Refill', field: 'refill', validate: p => p.refill == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Creation Date', render: (entry) => { 
                            let d = new Date(entry.creation_date);
                            return d.getMonth()+1+"-"+d.getUTCDate()+"-"+d.getFullYear();
                            }, validate: p => p.creation_date == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                    ]}
                    data={this.state.prescriptions}
                />
            </div>

        )
    }

}