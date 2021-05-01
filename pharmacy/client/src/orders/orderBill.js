import React from 'react';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { app_login } from '../redux/actions/userActions';
import { getMedicine } from '../medicines/medicinesService';
import { Container, Col, Row } from 'react-bootstrap';
import { getOrder } from './ordersService';
import { getPrescriptionsByOrderId } from '../prescriptions/prescriptionsService';
import { getSalesByOrderId } from '../sales/salesService';
import { Fragment } from 'react';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export class OrderBill extends React.Component {

    state = {
        order: {},
        prescriptions: [],
        sales: [],
    }

    async componentDidMount() {
        const medicine_order_id = this.props.match.params.order;
        const order = await getOrder(medicine_order_id);
        this.setState({ order });

        if (order && order.order_id != -1) {
            const prescriptions = await getPrescriptionsByOrderId(order.order_id)
            if (prescriptions) {
                for (var i = 0; i < prescriptions.length; i++) {
                    const prescription = prescriptions[i];
                    prescription.medicine = await getMedicine(prescription.medicine_id);
                }
                this.setState({ prescriptions });
            }
        }

        let sales = await getSalesByOrderId(order.medicine_order_id)
        if (sales) {
            for (var i = 0; i < sales.length; i++) {
                const sale = sales[i];
                sale.medicine = await getMedicine(sale.medicine_id);
            }
            this.setState({ sales });
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
        const prescriptions = this.state.prescriptions;
        const sales = this.state.sales;
        const prescriptionsHtml = prescriptions.map(prescription => {
            return (
                <Fragment>
                    <tr>
                        <td>{prescription.medicine.medicine_code}</td>
                        <td>{prescription.medicine.medical_name}</td>
                        <td>{prescription.medicine.commercial_name}</td>
                        <td>{prescription.quantity}</td>
                        <td>{currencyFormatter.format(prescription.medicine.cost * prescription.quantity)}</td>
                        <td>{currencyFormatter.format(prescription.medicine.cost * prescription.quantity - (prescription.insurance_coverage))}</td>
                        <td>{currencyFormatter.format((prescription.medicine.cost * prescription.quantity) - (prescription.medicine.cost * prescription.quantity - (prescription.insurance_coverage)))}</td>
                    </tr>
                </Fragment>
            );
        });

        const salesHtml = sales.map(sale => {
            return (
                <Fragment>
                    <tr>
                        <td>{sale.medicine.medicine_code}</td>
                        <td>{sale.medicine.medical_name}</td>
                        <td>{sale.medicine.commercial_name}</td>
                        <td>{sale.quantity}</td>
                        <td>{currencyFormatter.format(sale.medicine.cost * sale.quantity)}</td>
                        <td>N/A</td>
                        <td>{currencyFormatter.format(sale.medicine.cost * sale.quantity)}</td>
                    </tr>
                </Fragment>
            );
        });

        let subtotal = prescriptions.reduce((a, prescription) => a + (prescription.medicine.cost * prescription.quantity) - (prescription.medicine.cost * prescription.quantity - (prescription.insurance_coverage)), 0);
        subtotal += sales.reduce((a, sale) => a + (sale.medicine.cost * sale.quantity), 0)
        const tax = subtotal * .055;
        const total = subtotal * 1.055;
        const totalHtml = (
            <Fragment>
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
                    <td>{currencyFormatter.format(subtotal)}</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>Tax (5.5%):</td>
                    <td>{currencyFormatter.format(tax)}</td>
                </tr>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>Total:</td>
                    <td>{currencyFormatter.format(total)}</td>
                </tr>
            </Fragment>
        );

        return (
            <Container fluid className="card card-body bg-light">
                <Row>
                    <Col>
                        <div style={{ border: "1px solid black", padding: "10px" }}>
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
                                <p class="entry">{new Date(this.state.order.order_date).toDateString()}</p>
                            </div>
                            <div>
                                <label style={classes.p_label}>Patient: </label>
                                <p>{this.state.order.patient_first_name} {this.state.order.patient_last_name}</p>
                            </div>
                            {/* <div>
                    <label style={classes.p_label}>Physician: </label>
                    <p>{this.state.prescription.physician_first_name} {this.state.order.physician_last_name}</p>
                    <hr></hr>
                </div> */}
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
                                    {prescriptionsHtml}
                                    {salesHtml}
                                    {totalHtml}
                                </table>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }


}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_login };

export default connect(mapState, mapDispatch)(OrderBill);