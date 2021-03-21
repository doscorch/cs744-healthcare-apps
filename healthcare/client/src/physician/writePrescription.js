import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Alert from '@material-ui/lab/Alert';
import { Row, Col, Card } from 'react-bootstrap';

import { connect } from 'react-redux';
import { app_login } from '../redux/actions/userActions';

import { getPhysician, getPatient, savePrescription } from './physicianService';
import Icon from '@material-ui/core/Icon';
const initState = {
    first_name: "",
    last_name: "",
    prescription: "",
    quantity: "",
    dosage: "",
    refill: ""
}


export class WritePrescription extends React.Component {

    state = {
        ...initState,
        physician: "",
        patient: "",
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

    savePrescription = async (e) => {
        e.preventDefault();
        if(!this.state.prescription){
            this.setState({ error: "Please enter a prescription"});
            return;
        }
        if(!this.state.dosage){
            this.setState({ error: "Please enter a dosage"});
            return;
        }
        if(!this.state.refill){
            this.setState({ error: "Please enter a refill amount"});
            return;
        }
        if(!this.state.quantity){
            this.setState({ error: "Please enter a quantity amount"});
            return;
        }
        if(!this.state.refill.match(/^[1-9]+[0-9]*$/)){
            this.setState({ error: "Please enter a whole number refill amount"});
            return;
        }
        if(!this.state.quantity.match(/^[1-9]+[0-9]*$/)){
            this.setState({ error: "Please enter a whole number quntity amount"});
            return;
        }

        let response = await savePrescription(this.props.user.user_id, this.props.match.params.patient, 
            this.state.prescription, this.state.dosage, this.state.quantity, this.state.refill);
        if(response.err){
            this.setState({ error: response.err});
            return;
        }else{
            this.setState({ success: "Prescirption Saved!", error: ""})
        }
    }

    async componentDidMount() {
        const patient_id = this.props.match.params.patient;
        //get physician info
        const physician = await getPhysician();
        if(physician.err){
            let state = { ...this.state };
            state['error'] = physician.err;
            this.setState(state);
            return;
        }
        //get patient info
        const patient = await getPatient(patient_id);
        if(patient.err){
            let state = { ...this.state };
            state['error'] = patient.err;
            this.setState(state);
        }
        

        let state = { ...this.state };
        state['patient'] = patient;
        state['physician'] = physician;
        this.setState(state);
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
        };
        let error = this.state.error ? <Alert severity="error">{this.state.error}</Alert> : "";
        let success = this.state.success ? <Alert severity="success">{this.state.success}</Alert> : "";

        return (
            <Container component="main" maxWidth="xs" >
                <div style={classes.paper}>
                    <Icon>medication</Icon>
                    <Typography component="h1" variant="h5">Prescription</Typography>
                    <Card bg="light" style={{ padding: "10px", width: "100%" }}>
                            <Row>
                                <Col>
                                    <h4>Physician</h4>
                                    <hr></hr>
                                    <h6>Name</h6>
                                    <p>{this.state.physician.first_name} {this.state.physician.last_name}</p>
                                    <h6>License</h6>
                                    <p>{this.state.physician.physician_state} {this.state.physician.license_number}</p>
                                    <br></br>
                                    <h4>Patient</h4>
                                    <hr></hr>
                                    <h6>Name</h6>
                                    <p>{this.state.patient.first_name} {this.state.patient.last_name}</p>
                                    <h6>Address</h6>
                                    <p>{this.state.patient.address}</p>
                                    <h6>Date of Birth</h6>
                                    <p>{this.state.patient.date_of_birth}</p>
                                </Col>
                            </Row>
                        </Card>
                    <form style={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="prescription"
                                    name="prescription"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="prescription"
                                    label="Prescription"
                                    autoFocus
                                    required
                                    value={this.state.prescription}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="dosage"
                                    label="Dosage"
                                    name="dosage"
                                    autoComplete="dosage"
                                    value={this.state.dosage}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="quantity"
                                    label="Quantity"
                                    name="quantity"
                                    autoComplete="1"
                                    value={this.state.quantity}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="refill"
                                    label="Refill"
                                    id="refill"
                                    autoComplete="0"
                                    value={this.state.refill}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                        </Grid>
                        {this.state.patient && this.state.physician ? 
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={classes.submit}
                            onClick={this.savePrescription}>
                            Save Prescription
                        </Button>: ""}
                        
                    </form>
                    {error}
                    {success}
                </div>
            </Container>
        );
    }


}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_login };

export default connect(mapState, mapDispatch)(WritePrescription);