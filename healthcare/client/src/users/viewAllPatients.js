import * as React from 'react';
import MaterialTable from 'material-table';
import { Select, MenuItem } from '@material-ui/core'
import { getUsers, patchUser, getAllPatients } from '../auth/usersService';
import { UserType, UserStatus } from '../models/user';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';

export default class ViewAllPAtients extends React.Component {
    state = {
        patients: []
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        return getAllPatients()
            .then(patients => {
                this.setState({ patients: patients })
            })
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
                    actions={
                        [
                            {
                                icon: 'list',
                                tooltip: 'View Prescriptions',
                                onClick: (event, row) => {
                                    const patient_id = row.user_id;
                                    this.props.history.push("/patient/"+patient_id+"/prescriptions");
                                }
                            },
                            {
                                icon: 'insert_chart',
                                tooltip: 'Patient Visits',
                                onClick: (event, row) => {
                                    const patient_id = row.user_id;
                                    this.props.history.push("/visitations/"+patient_id);
                                }
                            }
                        ]
                    }
                    title="Patients"
                    columns={[
                        // { title: 'Id', field: '_id' },
                        { title: 'Patient Name', render: (patient)=> {return patient.patient_first+" "+patient.patient_last}, validate: u => u.patient_first == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Address', field: 'address', validate: u => u.address == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Date of Birth', render: (entry) => { 
                            let d = new Date(entry.date_of_birth);
                            return d.getMonth()+1+"-"+d.getUTCDate()+"-"+d.getFullYear();
                            }, validate: u => u.date_of_birth == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                            { title: 'Physician', render: (patient)=> {return patient.physician_first+" "+patient.physician_last}, validate: u => u.physician_first == "" ? { isValid: false, helperText: "required" } : { isValid: true } }
                    ]}
                    data={this.state.patients}
                />
            </div>

        )
    }

}