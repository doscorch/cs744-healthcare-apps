import React from 'react';
import { connect } from 'react-redux';
import { app_login } from '../redux/actions/userActions';
import { getPrescription, patchPrescription } from './prescriptionsService';
import { Button, Container, Col, Row } from 'react-bootstrap';
import MaterialTable from 'material-table';
import { getPhysicians } from '../physicians/physiciansService';
import { PrescriptionStatus } from '../models/prescription';

const initState = {
    prescription: ""
}

export class VerifyPatient extends React.Component {

    state = {
        ...initState,
        prescription: "",
        physicians: []
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

        getPhysicians()
            .then(physicians => {
                physicians = physicians.map(p => { return { ...p, name: p.first_name + " " + p.last_name } })
                this.setState({ physicians: physicians })
            })
    }
    render() {
        const tableRef = React.createRef();
        const tableRef1 = React.createRef();
        return (
            <Container fluid className="card card-body bg-light">
                <Row>
                    <Col><h5>Verify Physician <i class="fas fa-user-check"></i></h5></Col>
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
                            title="Physician on Prescription"
                            columns={[
                                { title: 'Name', render: p => (`${p.physician_first_name} ${p.physician_last_name}`) },
                                { title: 'Healthcare Institution', type: 'date', field: 'physician_institution' },
                                { title: 'License Number', field: 'physician_license_number' },
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
                            title="Find Physician in System"
                            columns={[
                                { title: 'Name', field: "name" },
                                { title: 'Healthcare Institution', type: 'date', field: 'institution' },
                                { title: 'License Number', field: 'license' },
                            ]}
                            data={this.state.physicians}
                            actions={[
                                {
                                    icon: 'check',
                                    tooltip: 'Match',
                                    onClick: (event, row) => {
                                        const prescription = this.state.prescriptions[0];
                                        patchPrescription(prescription.prescription_id, { physician_id: row.physician_id, order_status: PrescriptionStatus.Verified_Physician }).then(_ => {
                                            this.props.history.push("/fill-prescription/" + prescription.prescription_id);
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