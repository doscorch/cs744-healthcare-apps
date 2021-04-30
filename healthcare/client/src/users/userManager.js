import * as React from 'react';
import MaterialTable from 'material-table';
import { Select, MenuItem } from '@material-ui/core'
import { getUsers, patchUser } from '../auth/usersService';
import { UserType, UserStatus } from '../models/user';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';

export default class UserManager extends React.Component {
    state = {
        users: []
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        return getUsers()
            .then(users => {
                this.setState({ users: users })
            })
    }

    render() {
        const tableRef = React.createRef();
        return (
            <div>
                <Nav.Link as={Link} to="/register"><i className="fas fa-plus"></i> Register User</Nav.Link>
                <MaterialTable
                    tableRef={tableRef}
                    options={{
                        sorting: true,
                        search: true,
                        paging: false,
                    }}
                    actions={[
                        rowData => ({
                            icon: 'medical_services',
                            tooltip: 'Edit Healthcare Details',
                            onClick: (event, rowData) => {
                                if(rowData.user_type == UserType.Physician){
                                    this.props.history.push("/users/physician/"+rowData.user_id);
                                }else if(rowData.user_type == UserType.Patient){
                                    this.props.history.push("/users/patient/"+rowData.user_id);
                                }
                            },
                            disabled: rowData.user_type != UserType.Patient && rowData.user_type != UserType.Physician
                          })
                    ]}
                    title="Users"
                    columns={[
                        // { title: 'Id', field: '_id' },
                        { title: 'Username', field: 'username', editable: false },
                        { title: 'First Name', field: 'first_name', validate: u => u.first_name == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Last Name', field: 'last_name', validate: u => u.last_name == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        {
                            title: 'User Type',
                            field: 'user_type',
                            editable: false,
                            render: u => <span>{UserType.GetTranslation(u.user_type)}</span>,
                            // editComponent: props => (
                            //     <Select
                            //         id="user-type"
                            //         value={props.value}
                            //         onChange={e => props.onChange(e.target.value)}
                            //     >
                            //         <MenuItem value={UserType.Physician}>{UserType.GetTranslation(UserType.Physician)}</MenuItem>
                            //         <MenuItem value={UserType.Patient}>{UserType.GetTranslation(UserType.Patient)}</MenuItem>
                            //         <MenuItem value={UserType.Admin}>{UserType.GetTranslation(UserType.Admin)}</MenuItem>
                            //     </Select>),
                        },
                        {
                            title: 'User Status',
                            field: 'user_status',
                            render: u => <span>{UserStatus.GetTranslation(u.user_status)}</span>,
                            editComponent: props => (
                                <Select
                                    id="user-status"
                                    value={props.value}
                                    onChange={e => props.onChange(e.target.value)}
                                >
                                    <MenuItem value={UserStatus.Active}>{UserStatus.GetTranslation(UserStatus.Active)}</MenuItem>
                                    <MenuItem value={UserStatus.Inactive}>{UserStatus.GetTranslation(UserStatus.Inactive)}</MenuItem>
                                    <MenuItem value={UserStatus.Disabled}>{UserStatus.GetTranslation(UserStatus.Disabled)}</MenuItem>
                                </Select>),
                        }
                    ]}
                    data={this.state.users}
                    editable={{
                        onRowUpdate: (newData, oldData) => {
                            return patchUser(newData.user_id, newData).then(_ => this.getData())
                        },
                    }}
                />
            </div>

        )
    }

}
