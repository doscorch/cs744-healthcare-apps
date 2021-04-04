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

import {getPrescription} from './prescriptionService';
import Icon from '@material-ui/core/Icon';
const initState = {
    prescription: ""
}


export class ViewPrescription extends React.Component {

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
        const prescription_med_id = this.props.match.params.prescriptionmed;
        console.log(this.props.match.params);
        let prescription = await getPrescription(prescription_id, prescription_med_id);
        console.log(prescription);
        if(prescription.error){
            this.setState({error: prescription.error});
            return;
        }
        let d = new Date(prescription.creation_date);
        let dateString = d.getMonth()+1+"-"+d.getDate()+"-"+d.getFullYear();
        prescription.date = dateString;
        let dob = new Date(prescription.date_of_birth);
        let dobString = dob.getMonth()+1+"-"+dob.getDate()+"-"+dob.getFullYear();
        prescription.date_of_birth = dobString;
        let state = { ...this.state };
        state['prescription'] = prescription;
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
            p_label:{
                float: "left",
                marginRight: "10px"
            },
            entry:{
                display: "inline"
            }
        };
        let error = this.state.error ? <Alert severity="error">{this.state.error}</Alert> : "";
        let success = this.state.success ? <Alert severity="success">{this.state.success}</Alert> : "";

        return (
            <Container component="main" maxWidth="xs" >
                <div style={classes.paper}>
                    <Icon>medication</Icon>
                    <Typography component="h1" variant="h5">Prescription</Typography>
                    {this.state.prescription != "" ? 
                    <div style={{border: "1px solid black", padding: "10px"}}>
                        <div>
                            <img src={process.env.PUBLIC_URL + '/logo.png'} alt="logo image" style={{ width: "100px", float: "left" }}></img>
                            <h1>Peach Healthcare</h1>
                            <h3>La Crosse, WI 54601</h3>
                            <label style={classes.p_label}>Website: </label>
                            <a href="http://138.49.101.87/peachhealthcare">138.49.101.87/peachhealthcare</a>
                            <hr></hr>
                        </div>
                        <div>
                            <label style={classes.p_label}>Date: </label>
                            <p class="entry">{this.state.prescription.date}</p>
                            <hr></hr>
                        </div>
                        <div>
                            <label style={classes.p_label}>Physician: </label>
                            <p>{this.state.prescription.physician_first_name} {this.state.prescription.physician_last_name}</p>
                            <label style={classes.p_label}>License: </label>
                            <p>{this.state.prescription.physician_state}-{this.state.prescription.license_number}</p>
                            <hr></hr>
                        </div>
                        <div>
                            <label style={classes.p_label}>Patient: </label>
                            <p>{this.state.prescription.patient_first_name} {this.state.prescription.patient_last_name}</p>
                            <label style={classes.p_label}>Date of Birth: </label>
                            <p>{this.state.prescription.date_of_birth}</p>
                            <label style={classes.p_label}>Address: </label>
                            <p>{this.state.prescription.address}</p>
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
                            <label style={{marginBottom: "40px"}}>Signature: </label>
                        </div>
                    </div>
                    : ""}
                    {error}
                    {success}
                </div>
            </Container>
        );
    }


}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_login };

export default connect(mapState, mapDispatch)(ViewPrescription);