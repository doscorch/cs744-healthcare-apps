import * as React from 'react';
import MaterialTable from 'material-table';
import TextField from '@material-ui/core/TextField';
import { createMedicine, getMedicines, patchMedicine, deleteMedicine } from './medicinesService';
import { Select, MenuItem } from '@material-ui/core'

const zipRegex = /^\d{5}$|^\d{5}-\d{4}$/;

export default class MedicineManager extends React.Component {
    state = {
        medicines: []
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        return getMedicines()
            .then(medicines => {
                this.setState({ medicines: medicines })
            })
    }

    generateCode = () => {
        var result = '';
        while (result == '' || this.state.medicines.some(m => m.medicine_code == result)) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const numbers = '0123456789'
            for (var i = 0; i < 3; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            for (var i = 0; i < 5; i++) {
                result += numbers.charAt(Math.floor(Math.random() * numbers.length));
            }
        }

        return result;
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
                    title="Medicines"
                    columns={[
                        // { title: 'Medicine Code', field: 'medicine_code', validate: u => u.medicine_code == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        {
                            title: 'Medicine Code',
                            field: 'medicine_code',
                            validate: u => u.medicine_code == "" ? { isValid: false, helperText: "required" } : { isValid: true },
                        },
                        { title: 'Medical Name', field: 'medical_name', validate: u => u.medical_name == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Commercial Name', field: 'commercial_name', validate: u => u.commercial_name == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Type', field: 'medicine_type', validate: u => u.medicine_type == "" ? { isValid: false, helperText: "required" } : { isValid: true }, lookup: { 1: 'capsule', 2: 'tablet', 3: 'liquid' }, },
                        { title: 'Recommended Dosage', field: 'recommended_dosage', validate: u => u.recommended_dosage == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Cost', field: 'cost', type: "currency", validate: u => u.cost == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Quantity', field: 'quantity', type: 'numeric' },
                        { title: 'Vendor', field: 'vendor', validate: u => u.vendor == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Expiration Date', field: 'expiration_date', type: 'date', validate: u => u.expiration_date == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Requires Prescription', field: 'requires_prescription', type: 'boolean' },

                    ]}
                    data={this.state.medicines}
                    editable={{
                        onRowUpdate: (newData, oldData) => {
                            return patchMedicine(newData.medicine_id, newData).then(_ => this.getData())
                        },
                        onRowAdd: newData => {
                            newData.requires_prescription = !!newData.requires_prescription;
                            return createMedicine(newData).then(_ => this.getData())
                        },
                        onRowDelete: oldData => {
                            return deleteMedicine(oldData.medicine_id).then(_ => this.getData())
                        }
                    }}
                />
            </div>

        )
    }
}
