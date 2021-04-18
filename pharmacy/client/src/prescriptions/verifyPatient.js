import React from 'react';
import { connect } from 'react-redux';
import { app_login } from '../redux/actions/userActions';
import { getPrescription, patchPrescription } from './prescriptionsService';
import { Button, Container, Col, Row } from 'react-bootstrap';
import MaterialTable from 'material-table';
import { getPatients } from '../patients/patientsService';
import { PrescriptionStatus } from '../models/prescription';


const initState = {
    prescription: ""
}

export class VerifyPatient extends React.Component {

    state = {
        ...initState,
        prescription: "",
        patients: []
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

        getPatients()
            .then(patients => {
                this.setState({ patients: patients })
            })
    }
    render() {
        const tableRef = React.createRef();
        const tableRef1 = React.createRef();
        return (
            <Container fluid className="card card-body bg-light">
                <Row>
                    <Col><h5>Verify Patient <i class="fas fa-user-check"></i></h5></Col>
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
                            title="Patient on Prescription"
                            columns={[
                                { title: 'Name', render: p => (`${p.patient_first_name} ${p.patient_last_name}`) },
                                { title: 'Date of birth', type: 'date', field: 'patient_date_of_birth' },
                                { title: 'Address', field: 'patient_address' },
                            ]}
                            data={this.state.prescriptions}
                        />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <MaterialTable
                            tableRef={tableRef1}
                            options={{
                                sorting: true,
                                search: true,
                                paging: true,
                                editable: false,
                                pageSize: 3,
                            }}
                            title="Patient in System"
                            columns={[
                                { title: 'Name', render: p => (`${p.first_name} ${p.last_name}`) },
                                { title: 'Date of birth', type: 'date', field: 'birth_date' },
                                { title: 'Address', render: p => (`${p.address} ${p.city} ${p.state} ${p.zipcode}`) },
                            ]}
                            data={this.state.patients}
                            actions={[
                                {
                                    icon: 'check',
                                    tooltip: 'Match',
                                    onClick: (event, row) => {
                                        const prescription = this.state.prescriptions[0];
                                        patchPrescription(prescription.prescription_id, { patient_id: row.patient_id, order_status: PrescriptionStatus.Verified_Patient }).then(_ => {
                                            this.props.history.push("/verify-physician/" + prescription.prescription_id);
                                        })
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

export default connect(mapState, mapDispatch)(VerifyPatient);