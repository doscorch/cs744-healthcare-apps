import * as React from 'react';
import MaterialTable from 'material-table';
import { Select, MenuItem } from '@material-ui/core'
import { getUsers, patchUser } from '../auth/usersService';

export default class UserManager extends React.Component {
    state = {
        users: []
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        let url = 'http://localhost:3030/users'
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
                    { title: 'First Name', field: 'firstName' },
                    { title: 'Last Name', field: 'lastName' },
                    {
                        title: 'User Role',
                        field: 'userRole',
                        editComponent: props => (
                            <Select
                                id="userrole"
                                value={props.value || false}
                                onChange={e => props.onChange(e.target.value)}
                            >
                                <MenuItem value={"physician"}>physician</MenuItem>
                                <MenuItem value={"patient"}>patient</MenuItem>
                                <MenuItem value={"admin"}>admin</MenuItem>
                            </Select>),
                    },
                    {
                        title: 'Is Active',
                        field: 'isActive',
                        render: row => (<span>{String(typeof row.isActive === "undefined" ? true : row.isActive)}</span>),
                        editComponent: props => (
                            <Select
                                id="isActive"
                                value={typeof props.value === "undefined" ? true : props.value}
                                onChange={e => props.onChange(e.target.value)}
                            >
                                <MenuItem value={true}>true</MenuItem>
                                <MenuItem value={false}>false</MenuItem>
                            </Select>),
                    },
                ]}
                data={this.state.users}
                editable={{
                    onRowUpdate: (newData, oldData) => {
                        return patchUser(newData).then(_ => this.getData())
                    },
                }}
            />
        )
    }

}
