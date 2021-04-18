import * as React from 'react';
import MaterialTable from 'material-table';
import { Select, MenuItem } from '@material-ui/core'
import { getUsers, patchUser, getPhysicians } from '../auth/usersService';
import { UserType, UserStatus } from '../models/user';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';

export default class ViewAllPAtients extends React.Component {
    state = {
        physicians: []
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        return getPhysicians()
            .then(physicians => {
                this.setState({ physicians: physicians.data })
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
                                tooltip: 'View Patients',
                                onClick: (event, row) => {
                                    const physician_id = row.user_id;
                                    this.props.history.push("/search-patients/"+physician_id);
                                }
                            },
                        ]
                    }
                    title="Physicians"
                    columns={[
                        // { title: 'Id', field: '_id' },
                        { title: 'Physician Name', render: (physician)=> {return physician.first_name+" "+physician.last_name}, validate: u => u.first_name == "" ? { isValid: false, helperText: "required" } : { isValid: true }, customFilterAndSearch: (term,row) => (row.first_name+" "+row.last_name).indexOf(term) != -1 },
                        { title: 'License Number', render: (physician)=> {return physician.physician_state+"-"+physician.license_number}, validate: u => u.license_number == "" ? { isValid: false, helperText: "required" } : { isValid: true }, customFilterAndSearch: (term,row) => (row.physician_state+"-"+row.license_number).indexOf(term) != -1 },
                    ]}
                    data={this.state.physicians}
                />
            </div>

        )
    }

}