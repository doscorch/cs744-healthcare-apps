import * as React from 'react';
import MaterialTable from 'material-table';
import { getPrescriptions, patchPrescription, createPrescription, deletePrescription } from './prescriptionsService';

export default class PrescriptionManager extends React.Component {
    state = {
        prescriptions: []
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        return getPrescriptions()
            .then(prescriptions => {
                this.setState({ prescriptions: prescriptions })
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
                    title="Prescriptions"
                    columns={[
                        { title: 'Order date', field: 'order_date' },
                        { title: 'Patient name', render: p => (p.patient_first_name + " " + p.patient_last_name) },
                        { title: 'Prescription', field: 'prescription' },
                        { title: 'Status', field: 'order_status' },
                    ]}
                    data={this.state.prescriptions}
                // editable={{
                //     // onRowUpdate: (newData, oldData) => {
                //     //     return patchPrescription(newData.prescription_id, newData).then(_ => this.getData())
                //     // },
                //     // onRowAdd: newData => {
                //     //     return createPrescription(newData).then(_ => this.getData())
                //     // },
                //     // onRowDelete: oldData => {
                //     //     return deletePrescription(oldData.prescription_id).then(_ => this.getData())
                //     // }
                // }}
                />
            </div>

        )
    }

}
