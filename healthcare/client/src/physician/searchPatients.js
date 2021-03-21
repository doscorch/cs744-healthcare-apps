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
        this.getData();
    }

    getData = () => {
        return getPatients()
            .then(users => {
                this.setState({ users: users })
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
                            }
                        ]
                    }
                    columns={[
                        // { title: 'Id', field: '_id' },
                        { title: 'First Name', field: 'first_name', validate: u => u.first_name == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Last Name', field: 'last_name', validate: u => u.last_name == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Date of Birth', field: 'date_of_birth', validate: u => u.date_of_birth == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Address', field: 'address', validate: u => u.address == "" ? { isValid: false, helperText: "required" } : { isValid: true } }
                    ]}
                    data={this.state.users}
                />
            </div>

        )
    }

}