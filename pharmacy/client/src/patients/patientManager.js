import * as React from 'react';
import MaterialTable from 'material-table';
import TextField from '@material-ui/core/TextField';
import { createPatient, getPatients, patchPatient, deletePatient } from './patientsService';
import US_States from '../models/states';
import { Select, MenuItem } from '@material-ui/core'

const zipRegex = /^\d{5}$|^\d{5}-\d{4}$/;

export default class PatientManager extends React.Component {
    state = {
        patients: []
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        return getPatients()
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
                        paging: true,
                        editable: true,
                    }}
                    title="Patients"
                    columns={[
                        { title: 'First name', field: 'first_name', validate: u => u.first_name == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Last name', field: 'last_name', validate: u => u.last_name == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Date of birth', type: 'date', field: 'birth_date', validate: u => u.birth_date == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Address', field: 'address', validate: u => u.address == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'City', field: 'city', validate: u => u.city == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        {
                            title: 'State',
                            field: 'state',
                            render: u => <span>{u.state}</span>,
                            validate: u => u.state == "" ? { isValid: false, helperText: "required" } : { isValid: true },
                            editComponent: props => (
                                <Select
                                    id="state"
                                    value={props.value}
                                    onChange={e => props.onChange(e.target.value)}
                                >
                                    {US_States.map(s => <MenuItem value={s.abbreviation}>{s.abbreviation}</MenuItem>)}
                                </Select>),
                        },
                        { title: 'Zipcode', field: 'zipcode', validate: u => u.zipcode == "" ? { isValid: false, helperText: "required" } : (!zipRegex.test(u.zipcode) && u.zipcode != undefined ? { isValid: false, helperText: "Invalid format (NNNNN, NNNNN-NNNN)" } : { isValid: true }) },
                    ]}
                    data={this.state.patients}
                    editable={{
                        onRowUpdate: (newData, oldData) => {
                            return patchPatient(newData.patient_id, newData).then(_ => this.getData())
                        },
                        onRowAdd: newData => {
                            return createPatient(newData).then(_ => this.getData())
                        },
                        onRowDelete: oldData => {
                            return deletePatient(oldData.patient_id).then(_ => this.getData())
                        }
                    }}
                />
            </div>

        )
    }

}
