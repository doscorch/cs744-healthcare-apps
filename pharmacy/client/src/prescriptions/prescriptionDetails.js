import React from 'react';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { app_login } from '../redux/actions/userActions';
import { getPrescription } from './prescriptionsService';
import Icon from '@material-ui/core/Icon';
import { getPhysician } from '../physicians/physiciansService';
import { getPatient } from '../patients/patientsService';
import { getMedicine } from '../medicines/medicinesService';
import { Container, Col, Row } from 'react-bootstrap';
import { PrescriptionStatus } from '../models/prescription';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export class PrescriptionDetails extends React.Component {

    state = {
        prescription: {},
        medicine: {},
        patient: {},
        physician: {},
    }

    async componentDidMount() {
        const prescription_id = this.props.match.params.prescription;
        const prescription = await getPrescription(prescription_id);
        this.setState({ prescription });

        if (prescription && prescription.medicine_id != -1) {
            const medicine = await getMedicine(prescription.medicine_id)
            if (medicine) {
                this.setState({ medicine });
            }
        }
        if (prescription && prescription.physician_id != -1) {
            const physician = await getPhysician(prescription.physician_id)
            if (physician) {
                this.setState({ physician });
            }
        }
        if (prescription && prescription.patient_id != -1) {
            const patient = await getPatient(prescription.patient_id)
            if (patient) {
                this.setState({ patient });
            }
        }
    }
    render() {
        const classes = {
            paper: {
                marginTop: "10px",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            },
            form: {
                width: '100%',
                marginTop: "10px"
            },
            submit: {
                margin: "10px"
            },
            p_label: {
                float: "left",
                marginRight: "10px"
            },
            entry: {
                display: "inline"
            }
        };
        const prescription = this.state.prescription;
        const medicine = this.state.medicine;
        const patient = this.state.patient;
        const physician = this.state.physician;
        const prescriptionHTML = prescription.prescription_id
            ? (<div style={{ border: "1px solid black", padding: "10px" }}>
                <div>
                    <img src={process.env.PUBLIC_URL + '/healthcare_logo.png'} alt="logo image" style={{ width: "100px", float: "left" }}></img>
                    <h1>Peach Healthcare</h1>
                    <h3>La Crosse, WI 54601</h3>
                    <label style={classes.p_label}>Website: </label>
                    <a href="http://138.49.101.87/peachhealthcare">138.49.101.87/peachhealthcare</a>
                    <hr></hr>
                </div>
                <div>
                    <label style={classes.p_label}>Date: </label>
                    <p class="entry">{new Date(this.state.prescription.order_date).toDateString()}</p>
                    <hr></hr>
                </div>
                <div>
                    <label style={classes.p_label}>Physician: </label>
                    <p>{this.state.prescription.physician_first_name} {this.state.prescription.physician_last_name}</p>
                    <label style={classes.p_label}>License: </label>
                    <p>{this.state.prescription.physician_license_number}</p>
                    <hr></hr>
                </div>
                <div>
                    <label style={classes.p_label}>Patient: </label>
                    <p>{this.state.prescription.patient_first_name} {this.state.prescription.patient_last_name}</p>
                    <label style={classes.p_label}>Date of Birth: </label>
                    <p>{new Date(this.state.prescription.patient_date_of_birth).toDateString()}</p>
                    <label style={classes.p_label}>Address: </label>
                    <p>{this.state.prescription.patient_address}</p>
                    <hr></hr>
                </div>
                <div>
                    <label style={classes.p_label}>Prescription: </label>
                    <p>{this.state.prescription.prescription}</p>
                    <label style={classes.p_label}>Dosage: </label>
                    <p>{this.state.prescription.dosage}</p>
                    <label style={classes.p_label}>Quantity: </label>
                    <p>{this.state.prescription.quantity}</p>
                    <label style={classes.p_label}>Refill: </label>
                    <p>{this.state.prescription.refill}</p>
                    <label style={{ marginBottom: "40px" }}>Signature: </label>
                </div>
            </div>)
            : ""
        const medicineHTML = medicine.medicine_id
            ? (
                <div>
                    <hr></hr>
                    <Row>
                        <Col>
                            <h5><span>Medicine</span></h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3} >
                            <span>Medicine Code:</span>
                        </Col>
                        <Col>
                            {medicine.medicine_code}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3} >
                            <span>Medical Name:</span>
                        </Col>
                        <Col>
                            {medicine.medical_name}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3} >
                            <span>Commercial Name:</span>
                        </Col>
                        <Col>
                            {medicine.commercial_name}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3} >
                            <span>Expiration Date:</span>
                        </Col>
                        <Col>
                            {new Date(medicine.expiration_date).toDateString()}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3} >
                            <span>Cost:</span>
                        </Col>
                        <Col>
                            {this.state.medicine.cost ? currencyFormatter.format(this.state.medicine.cost) : 0}
                        </Col>
                    </Row>
                </div>
            )
            : "";
        const patientHTML = patient.patient_id
            ? (
                <div>
                    <hr></hr>
                    <Row>
                        <Col>
                            <h5><span>Patient</span></h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3} >
                            <span>Name:</span>
                        </Col>
                        <Col>
                            {patient.first_name} {patient.last_name}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3} >
                            <span>Date of Birth:</span>
                        </Col>
                        <Col>
                            {new Date(patient.birth_date).toDateString()}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3} >
                            <span>Address:</span>
                        </Col>
                        <Col>
                            {patient.address} {patient.city} {patient.state} {patient.zipcode}
                        </Col>
                    </Row>
                </div>
            )
            : "";
        const physicianHTML = physician.physician_id
            ? (
                <div>
                    <hr></hr>
                    <Row>
                        <Col>
                            <h5><span>Physician</span></h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3} >
                            <span>Name:</span>
                        </Col>
                        <Col>
                            {physician.first_name} {physician.last_name}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3} >
                            <span>Institution:</span>
                        </Col>
                        <Col>
                            {physician.institution}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3} >
                            <span>License Number:</span>
                        </Col>
                        <Col>
                            {physician.license}
                        </Col>
                    </Row>
                </div>
            )
            : "";

        return (
            <Container fluid className="card card-body bg-light">
                <Row>
                    <Col>
                        {prescriptionHTML}
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <h5><span>Status</span></h5>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <span>{PrescriptionStatus.GetTranslation(prescription.order_status)}</span>
                    </Col>
                </Row>

                {/* <Row>
                    <Col>
                        <h5>Prescription Details <i class="fas fa-info-circle"></i></h5>
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col>
                        <h5><span>Patient</span></h5>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3} >
                        <span>Name:</span>
                    </Col>
                    <Col>
                        {prescription.patient_first_name} {prescription.patient_last_name}
                    </Col>
                </Row>
                <Row>
                    <Col sm={3} >
                        <span>Date of Birth:</span>
                    </Col>
                    <Col>
                        {prescription.patient_date_of_birth ? new Date(prescription.patient_date_of_birth).toDateString() : ""}
                    </Col>
                </Row>
                <Row>
                    <Col sm={3} >
                        <span>Address:</span>
                    </Col>
                    <Col>
                        {prescription.patient_address}
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <h5><span>Physician</span></h5>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3} >
                        <span>Name:</span>
                    </Col>
                    <Col>
                        {prescription.physician_first_name} {prescription.physician_last_name}
                    </Col>
                </Row>
                <Row>
                    <Col sm={3} >
                        <span>Healthcare Institution:</span>
                    </Col>
                    <Col>
                        {prescription.physician_institution}
                    </Col>
                </Row>
                <Row>
                    <Col sm={3} >
                        <span>License Number:</span>
                    </Col>
                    <Col>
                        {prescription.physician_license_number}
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <h5><span>Prescription</span></h5>
                    </Col>
                </Row>
                <Row>
                    <Col sm={3} >
                        <span>Description:</span>
                    </Col>
                    <Col>
                        {prescription.prescription}
                    </Col>
                </Row>
                <Row>
                    <Col sm={3} >
                        <span>Dosage:</span>
                    </Col>
                    <Col>
                        {prescription.dosage}
                    </Col>
                </Row>
                <Row>
                    <Col sm={3} >
                        <span>Quantity:</span>
                    </Col>
                    <Col>
                        {prescription.quantity}
                    </Col>
                </Row>
                <Row>
                    <Col sm={3} >
                        <span>Refill:</span>
                    </Col>
                    <Col>
                        {prescription.refill}
                    </Col>
                </Row>
                <Row>
                    <Col sm={3} >
                        <span>Date:</span>
                    </Col>
                    <Col>
                        {prescription.order_date ? new Date(prescription.order_date).toDateString() : ""}
                    </Col>
                </Row> */}
                {patientHTML}
                {physicianHTML}
                {medicineHTML}

            </Container>
        );
    }


}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_login };

export default connect(mapState, mapDispatch)(PrescriptionDetails);