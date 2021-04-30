import React from 'react';
import { connect } from 'react-redux';
import { app_login } from '../redux/actions/userActions';
import { Container, Col, Row } from 'react-bootstrap';
import MaterialTable from 'material-table';
import { PrescriptionStatus } from '../models/prescription';
import { getMedicines, patchMedicine } from '../medicines/medicinesService';
import { Button, Input, InputLabel } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { createSale } from '../sales/salesService';

const initState = {
    prescription: ""
}

export class ADDOTC extends React.Component {

    state = {
        ...initState,
        medicines: [],
        quantity: 1,
    }

    changeForm = (e) => {
        let propName = e.target.name;
        let propValue = e.target.value;
        let state = { ...this.state };
        state[propName] = propValue;
        this.setState(state);
    }

    process = () => {
        if (this.state.quantity <= 0) {
            this.setState({ error: "please enter a valid quantity" })
        }
        else if (this.state.quantity > this.state.medicine.quantity) {
            this.setState({ error: "There is not enough medicine in stock to fill this order" })
        }
        else {
            const order_id = this.props.match.params.order;
            this.state.medicine.quantity -= this.state.quantity;
            patchMedicine(this.state.medicine.medicine_id, { quantity: this.state.medicine.quantity })
            createSale({ medicine_id: this.state.medicine.medicine_id, quantity: this.state.quantity, order_id: order_id })
            this.setState({ medicine: this.state.medicine, error: undefined, success: "added otc medicine to order" })
        }
    }

    clearMedicine = () => {
        this.setState({ medicine: undefined });
    }

    async componentDidMount() {
        getMedicines()
            .then(medicines => {
                medicines = medicines.filter(m => !m.requires_prescription)
                this.setState({ medicines: medicines })
            })
    }

    render() {
        const tableRef1 = React.createRef();
        let error = this.state.error ? <Alert severity="error">{this.state.error}</Alert> : "";
        let success = this.state.success ? <Alert severity="success">{this.state.success}</Alert> : "";
        return (
            <Container fluid className="card card-body bg-light">
                <Row>
                    <Col><h5>Add OTC Medicine <i class="fas fa-prescription-bottle-alt"></i></h5></Col>
                </Row>
                <br />

                {this.state.medicine
                    ? (
                        <div>
                            <Row>
                                <Col><h6>Medicine</h6></Col>
                            </Row>
                            <Row>
                                <Col sm="2">Code:</Col>
                                <Col>{this.state.medicine.medicine_code}</Col>
                            </Row>
                            <Row>
                                <Col sm="2">Medical Name:</Col>
                                <Col>{this.state.medicine.medical_name}</Col>
                            </Row>
                            <Row>
                                <Col sm="2">Commercial Name:</Col>
                                <Col>{this.state.medicine.commercial_name}</Col>
                            </Row>
                            <Row>
                                <Col sm="2">Quantity:</Col>
                                <Col>{this.state.medicine.quantity}</Col>
                            </Row>
                            <br></br>
                            <Row>
                                <Col>
                                    <InputLabel>Quantity Needed:</InputLabel>
                                    <Input type="value" type="number" value={this.state.quantity} name="quantity" onChange={this.changeForm} />
                                </Col>
                            </Row>
                            <br />
                            <Row>
                                <Col>
                                    <Button disabled={!this.state.medicine || this.state.success} variant="contained" color="primary" onClick={this.process}>Add to Order</Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {error}
                                    {success}
                                </Col>
                            </Row>
                        </div>

                    )
                    : (
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
                                            tooltip: 'Use',
                                            onClick: (event, row) => {
                                                this.setState({ medicine: row });
                                            }
                                        },
                                    ]}
                                />
                            </Col>
                        </Row>
                    )
                }


            </Container>
        );
    }


}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_login };

export default connect(mapState, mapDispatch)(ADDOTC);