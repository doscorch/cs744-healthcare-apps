import React from 'react';
import { connect } from 'react-redux';
import { app_login } from '../redux/actions/userActions';
import { getPrescription, patchPrescription, sendInsuranceRequest } from './prescriptionsService';
import { Container, Col, Row } from 'react-bootstrap';
import { Button } from '@material-ui/core';
import { getMedicines } from '../medicines/medicinesService';
import Alert from '@material-ui/lab/Alert';
import { PrescriptionStatus } from '../models/prescription';

const initState = {
    prescription: ""
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export class VerifyInsuranceRequest extends React.Component {

    state = {
        ...initState,
        prescription: "",
        error: "",
        success: ""
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
        let state = { ...this.state };
        state['prescription'] = prescription;
        this.setState(state);

        getMedicines().then(ms => this.setState({ medicine: ms.find(m => m.medicine_id == prescription.medicine_id) }))
    }

    send = () => {
        const prescription = this.state.prescription;
        sendInsuranceRequest(prescription.prescription_id).then(_ => {
            patchPrescription(prescription.prescription_id, { order_status: PrescriptionStatus.Pending_Insurance }).then(_ => {
                this.setState({ success: "Insurance Request Sent" })
            })
        })
    }

    render() {
        const prescription = this.state.prescription
        let error = this.state.error ? <Alert severity="error">{this.state.error}</Alert> : "";
        let success = this.state.success ? <Alert severity="success">{this.state.success}</Alert> : "";
        return (
            <Container fluid className="card card-body bg-light">
                <Row>
                    <Col>
                        <h5>Send Insurance Request <i class="fas fa-clipboard-check"></i></h5>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col sm={2}>
                        <b>Patient Name:</b>
                    </Col>
                    <Col>
                        {prescription.patient_first_name} {prescription.patient_last_name}
                    </Col>
                </Row>
                <Row>
                    <Col sm={2}>
                        <b>Date of Birth:</b>
                    </Col>
                    <Col>
                        {prescription.patient_date_of_birth}
                    </Col>
                </Row>
                <Row>
                    <Col sm={2}>
                        <b>Address:</b>
                    </Col>
                    <Col>
                        {prescription.patien_address} {prescription.patient_address}
                    </Col>
                </Row>
                <Row>
                    <Col sm={2}>
                        <b>Prescription:</b>
                    </Col>
                    <Col>
                        {prescription.prescription}
                    </Col>
                </Row>
                <Row>
                    <Col sm={2}>
                        <b>Quantity:</b>
                    </Col>
                    <Col>
                        {prescription.quantity}
                    </Col>
                </Row>
                <Row>
                    <Col sm={2}>
                        <b>Cost:</b>
                    </Col>
                    <Col>
                        {this.state.medicine ? currencyFormatter.format(this.state.medicine.cost) : 0}
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <Button disabled={this.state.success || this.state.error} variant="contained" color="primary" onClick={this.send}>Send Insurance Request<pre> </pre><i class="fas fa-paper-plane"></i></Button>
                    </Col>

                </Row>
                <Row>
                    <Col>
                        {error}
                        {success}
                    </Col>
                </Row>
            </Container>
        );
    }


}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_login };

export default connect(mapState, mapDispatch)(VerifyInsuranceRequest);