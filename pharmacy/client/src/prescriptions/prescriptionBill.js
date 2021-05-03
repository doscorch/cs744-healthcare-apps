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

export class PrescriptionBill extends React.Component {

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
            // const bill = {
            //     medicine_code: medicine.medicine_code, 
            //     medical_name: medicine.medical_name, 
            //     commercial_name: medicine.commercial_name, 
            //     quantity: prescription.quantity, 
            //     cost: medicine.cost, 
            //     insurance: medicine.commercial_name, 


            // }
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
        const billHTML = prescription.prescription_id
            ? (<div style={{ border: "1px solid black", padding: "10px" }}>
                <Container>
                    <Row>
                        <Col sm="2">
                            <img src={process.env.PUBLIC_URL + '/logo.png'} alt="logo image" style={{ width: "100px" }}></img>
                        </Col>
                        <Col>
                            <h1>Peach Insurance</h1>
                            <h3>La Crosse, WI 54601</h3>
                            <label style={classes.p_label}>Website: </label>
                            <a href="http://138.49.101.87/peachinsurance">138.49.101.87/peachinsurance</a>
                        </Col>
                    </Row>
                </Container>
                <hr></hr>
                <div>
                    <label style={classes.p_label}>Date: </label>
                    <p class="entry">{new Date(this.state.prescription.order_date).toDateString()}</p>
                </div>
                <div>
                    <label style={classes.p_label}>Patient: </label>
                    <p>{this.state.prescription.patient_first_name} {this.state.prescription.patient_last_name}</p>
                </div>
                <div>
                    <label style={classes.p_label}>Physician: </label>
                    <p>{this.state.prescription.physician_first_name} {this.state.prescription.physician_last_name}</p>
                    <hr></hr>
                </div>
                <div>
                    <table className="bill" style={{ width: "100%" }}>
                        <tr>
                            <th>Item Code</th>
                            <th>Medical Name</th>
                            <th>Commercial Name</th>
                            <th>Quantity</th>
                            <th>Cost of Medicine</th>
                            <th>Insurance Payment</th>
                            <th>Patient Pays</th>

                        </tr>
                        <tr>
                            <td>{medicine.medicine_code}</td>
                            <td>{medicine.medical_name}</td>
                            <td>{medicine.commercial_name}</td>
                            <td>{prescription.quantity}</td>
                            <td>{currencyFormatter.format(medicine.cost * prescription.quantity)}</td>
                            <td>{currencyFormatter.format((prescription.insurance_coverage))}</td>
                            <td>{currencyFormatter.format((medicine.cost * prescription.quantity) - (prescription.insurance_coverage))}</td>
                        </tr>
                        <tr>
                            <td><pre> </pre></td>
                            <td><pre> </pre></td>
                            <td><pre> </pre></td>
                            <td><pre> </pre></td>
                            <td><pre> </pre></td>
                            <td><pre> </pre></td>
                            <td><pre> </pre></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>Subtotal:</td>
                            <td>{currencyFormatter.format((medicine.cost * prescription.quantity) - (prescription.insurance_coverage))}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>Tax (5.5%):</td>
                            <td>{currencyFormatter.format(((medicine.cost * prescription.quantity) - (prescription.insurance_coverage)) * .055)}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>Total:</td>
                            <td>{currencyFormatter.format(((medicine.cost * prescription.quantity) - (prescription.insurance_coverage)) * 1.055)}</td>
                        </tr>
                        {/* <tr>
                            <td>Patient Pays</td>
                            <td>Jackson</td>
                            <td>94</td>
                        </tr> */}
                    </table>
                </div>
            </div>)
            : ""

        return (
            <Container fluid className="card card-body bg-light">
                <Row>
                    <Col>
                        {billHTML}
                    </Col>
                </Row>
            </Container>
        );
    }


}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_login };

export default connect(mapState, mapDispatch)(PrescriptionBill);