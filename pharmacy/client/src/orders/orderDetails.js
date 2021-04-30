import React from 'react';
import { connect } from 'react-redux';
import { app_login } from '../redux/actions/userActions';
import { getOrder } from './ordersService';
import { Container, Col, Row } from 'react-bootstrap';
import { getPrescriptionsByOrderId } from '../prescriptions/prescriptionsService';
import { PrescriptionStatus } from '../models/prescription';
import { getMedicine } from '../medicines/medicinesService';
import { getSalesByOrderId } from '../sales/salesService';
import { Card, CardContent } from '@material-ui/core';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export class OrderDetails extends React.Component {

    state = {
        order: {},
        prescriptions: [],
        sales: [],
    }

    async componentDidMount() {
        const order_id = this.props.match.params.order;
        const order = await getOrder(order_id);
        this.setState({ order });

        if (order && order.order_id != -1) {
            const prescriptions = await getPrescriptionsByOrderId(order.order_id)
            if (prescriptions) {
                this.setState({ prescriptions });
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
        const order = this.state.order;
        const prescriptions = this.state.prescriptions;
        const sales = this.state.sales;

        const orderHTML = order.medicine_order_id
            ? (
                <div>
                    <hr></hr>
                    <Row>
                        <Col>
                            <h5><span>Order</span></h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3} >
                            <span>Date:</span>
                        </Col>
                        <Col>
                            {new Date(order.order_date).toDateString()}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={3} >
                            <span>Patient Name:</span>
                        </Col>
                        <Col>
                            {order.patient_first_name} {order.patient_last_name}
                        </Col>
                    </Row>
                </div>
            )
            : "";

        return (
            <Container fluid className="card card-body bg-light">
                {orderHTML}

                <hr />
                <br />

                {prescriptions.length
                    ? (
                        <Row>
                            <Col>
                                <h5><span>Prescriptions</span></h5>
                            </Col>
                        </Row>
                    )
                    : ""}
                {prescriptions.map(p => {
                    return (
                        <div>

                            <Card>
                                <CardContent>
                                    <Row>
                                        <Col sm="2">
                                            <span>Description:</span>
                                        </Col>
                                        <Col>
                                            <span>{p.prescription}</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="2">
                                            <span>Dosage:</span>
                                        </Col>
                                        <Col>
                                            <span>{p.dosage}</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="2">
                                            <span>Quantity:</span>
                                        </Col>
                                        <Col>
                                            <span>{p.quantity}</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="2">
                                            <span>Refill:</span>
                                        </Col>
                                        <Col>
                                            <span>{p.refill}</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="2">
                                            <span>Status:</span>
                                        </Col>
                                        <Col>
                                            <span>{PrescriptionStatus.GetTranslation(p.order_status)}</span>
                                        </Col>
                                    </Row>
                                </CardContent>
                            </Card>
                            <br />
                        </div>

                    )
                })}
                <hr />

                {sales.length
                    ? (
                        <Row>
                            <Col>
                                <h5><span>OTC Items</span></h5>
                            </Col>
                        </Row>
                    )
                    : ""}
                {sales.map(s => {
                    return (
                        <div>

                            <Card>
                                <CardContent>
                                    <Row>
                                        <Col sm="2">
                                            <span>Item Number:</span>
                                        </Col>
                                        <Col>
                                            <span>{s.medicine.medicine_code}</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="2">
                                            <span>Medical Name:</span>
                                        </Col>
                                        <Col>
                                            <span>{s.medicine.medical_name}</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="2">
                                            <span>Commercial Name:</span>
                                        </Col>
                                        <Col>
                                            <span>{s.medicine.commercial_name}</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm="2">
                                            <span>Quantity:</span>
                                        </Col>
                                        <Col>
                                            <span>{s.quantity}</span>
                                        </Col>
                                    </Row>
                                    <br />
                                </CardContent>
                            </Card>
                            <br />
                        </div>)
                })}

            </Container>
        );
    }


}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_login };

export default connect(mapState, mapDispatch)(OrderDetails);