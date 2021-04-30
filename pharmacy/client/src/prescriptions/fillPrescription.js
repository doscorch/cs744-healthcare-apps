import React from 'react';
import { connect } from 'react-redux';
import { app_login } from '../redux/actions/userActions';
import { getPrescription, patchPrescription } from './prescriptionsService';
import { Button, Container, Col, Row } from 'react-bootstrap';
import MaterialTable from 'material-table';
import { getPhysicians } from '../physicians/physiciansService';
import { PrescriptionStatus } from '../models/prescription';
import { getMedicines, patchMedicine } from '../medicines/medicinesService';

const initState = {
    prescription: ""
}

export class FillPrescription extends React.Component {

    state = {
        ...initState,
        prescription: "",
        medicines: []
    }

    changeForm = (e) => {
        let propName = e.target.name;
        let propValue = e.target.value;
        let state = { ...this.state };
        state[propName] = propValue;
        this.setState(state);
    }

    async componentDidMount() {
        const prescription_id = this.props.match.params.prescription;
        const prescription = await getPrescription(prescription_id);
        if (prescription.error) {
            this.setState({ error: prescription.error });
            return;
        }
        this.setState({ prescriptions: [prescription] })

        getMedicines()
            .then(medicines => {
                medicines = medicines.filter(m => m.requires_prescription)
                this.setState({ medicines: medicines })
            })
    }
    render() {
        const tableRef = React.createRef();
        const tableRef1 = React.createRef();
        return (
            <Container fluid className="card card-body bg-light">
                <Row>
                    <Col><h5>Fill Prescription <i class="fas fa-prescription-bottle-alt"></i></h5></Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <MaterialTable
                            tableRef={tableRef}
                            options={{
                                sorting: false,
                                search: false,
                                paging: false,
                                editable: false,
                            }}
                            title="Prescription"
                            columns={[
                                { title: 'Description', field: "prescription" },
                                { title: 'Dosage', field: 'dosage' },
                                { title: 'Quantity', field: 'quantity' },
                            ]}
                            data={this.state.prescriptions}
                        />
                    </Col>
                </Row>
                <br></br>
                <Row>
                    <Col>
                        <MaterialTable
                            tableRef={tableRef1}
                            options={{
                                sorting: true,
                                search: true,
                                paging: true,
                                editable: false,
                                pageSize: 5,
                            }}
                            title="Medicine Stock"
                            columns={[
                                { title: 'Medical Name', field: "medical_name" },
                                { title: 'Commercial Name', field: "commercial_name" },
                                { title: 'Type', field: 'medicine_type', lookup: { 1: 'capsule', 2: 'tablet', 3: 'liquid' }, },
                                { title: 'Recommended Dosage', field: "recommended_dosage" },
                                { title: 'Quantity Available', field: "quantity" },
                            ]}
                            data={this.state.medicines}
                            actions={[
                                {
                                    icon: 'check',
                                    tooltip: 'Fill',
                                    onClick: (event, row) => {
                                        const prescription = this.state.prescriptions[0];
                                        if ((row.quantity - prescription.quantity) < 0) {
                                            alert("There is not enough medicine in stock to fill this prescription")
                                        }
                                        else {
                                            patchMedicine(row.medicine_id, { quantity: row.quantity - prescription.quantity })
                                            patchPrescription(prescription.prescription_id, { medicine_id: row.medicine_id, order_status: PrescriptionStatus.Filled }).then(_ => {
                                                this.props.history.push("/verify-insurance-request/" + prescription.prescription_id);
                                            })
                                        }
                                    }
                                },
                            ]}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }


}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_login };

export default connect(mapState, mapDispatch)(FillPrescription);