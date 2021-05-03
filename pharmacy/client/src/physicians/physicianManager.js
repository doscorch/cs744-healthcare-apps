import * as React from 'react';
import MaterialTable from 'material-table';
import { getPhysicians, patchPhysician, createPhysician, deletePhysician } from './physiciansService';

export default class PhysicianManager extends React.Component {
    state = {
        physicians: []
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        return getPhysicians()
            .then(physicians => {
                this.setState({ physicians: physicians })
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
                        paging: true,
                    }}
                    title="Physicians"
                    columns={[
                        // { title: 'Id', field: '_id' },
                        { title: 'First name', field: 'first_name', validate: u => u.first_name == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Last name', field: 'last_name', validate: u => u.last_name == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Institution', field: 'institution', validate: u => u.institution == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'License', field: 'license', validate: u => u.license == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                    ]}
                    data={this.state.physicians}
                    editable={{
                        onRowUpdate: (newData, oldData) => {
                            return patchPhysician(newData.physician_id, newData).then(_ => this.getData())
                        },
                        onRowAdd: newData => {
                            return createPhysician(newData).then(_ => this.getData())
                        },
                        onRowDelete: oldData => {
                            return deletePhysician(oldData.physician_id).then(_ => this.getData())
                        }
                    }}
                />
            </div>

        )
    }

}
