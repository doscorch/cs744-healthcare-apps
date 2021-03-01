import * as React from 'react';
import MaterialTable from 'material-table';
import { Select, MenuItem } from '@material-ui/core'
import { getUsers, patchUser } from '../auth/usersService';
import { UserType, UserStatus } from '../models/user';

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
            <MaterialTable
                tableRef={tableRef}
                options={{
                    sorting: true,
                    search: true,
                    paging: false,
                }}
                title="Users"
                columns={[
                    // { title: 'Id', field: '_id' },
                    { title: 'Username', field: 'username', editable: false },
                    { title: 'First Name', field: 'first_name' },
                    { title: 'Last Name', field: 'last_name' },
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
        )
    }

}
