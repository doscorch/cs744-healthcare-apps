import * as React from 'react';
import MaterialTable from 'material-table';
import { Select, MenuItem } from '@material-ui/core'
import { getUsers, patchUser } from '../auth/usersService';
import { getPatients } from '../physician/physicianService';
import { UserType, UserStatus } from '../models/user';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';

export default class searchPatients extends React.Component {
    state = {
        users: []
    }

    componentDidMount() {
        
        this.getData(this.props.match.params.physician);
    }

    getData = (physician_id) => {
        return getPatients(physician_id)
            .then(users => {
                this.setState({ users: users })
            })
    }

    render() {
        const convertDoB = (dob_string) =>{
            console.log(dob_string);
            let d = new Date(dob_string);
            let dateString = d.getMonth()+1+"-"+d.getUTCDate()+"-"+d.getFullYear();
            return dateString;
        }
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
                    title="Patients"
                    actions={
                        [
                            {
                                icon: 'medication',
                                tooltip: 'Write Prescription',
                                onClick: (event, row) => {
                                    const patient_id = row.user_id;
                                    this.props.history.push("/write-prescription/"+patient_id);
                                }
                            },
                            {
                                icon: 'list',
                                tooltip: 'View Prescriptions',
                                onClick: (event, row) => {
                                    const patient_id = row.user_id;
                                    this.props.history.push("/patient/"+patient_id+"/prescriptions");
                                }
                            },
                            {
                                icon: 'medical_services',
                                tooltip: 'Write Visitation Record',
                                onClick: (event, row) => {
                                    const patient_id = row.user_id;
                                    this.props.history.push("/write-visitation/"+patient_id);
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
                    columns={[
                        // { title: 'Id', field: '_id' },
                        { title: 'First Name', field: 'first_name', validate: u => u.first_name == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Last Name', field: 'last_name', validate: u => u.last_name == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Date of Birth', field: 'date_of_birth', render: u => convertDoB(u.date_of_birth), validate: u => u.date_of_birth == "" ? { isValid: false, helperText: "required" } : { isValid: true }, customFilterAndSearch: (term,row) => (convertDoB(row.date_of_birth)).indexOf(term) != -1 },
                        { title: 'Address', field: 'address', validate: u => u.address == "" ? { isValid: false, helperText: "required" } : { isValid: true } }
                    ]}
                    data={this.state.users}
                />
            </div>

        )
    }

}