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

import { getVisitation, sendVisitation } from './visitationService';
import Icon from '@material-ui/core/Icon';

import { UserType } from '../models/user';
const initState = {
    visitation: {procedures:[]}
}


export class ViewVisitation extends React.Component {

    state = {
        ...initState,
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

    sendToInsurance = async (e) => {
        let response = await sendVisitation(this.state.visitation);
        if(response.err){
            this.setState({error: response.err});
        }else{
            let v = this.state.visitation;
            v.status = 2;
            let state = { ...this.state };
            state['visitation'] = v;
            state['success'] = "Visitation successfully sent";
            this.setState(state);
        }
    }

    async componentDidMount() {
        const visit_id = this.props.match.params.visit;
        console.log(this.props.match.params);
        let visitation = await getVisitation(visit_id);
        console.log(visitation);
        if(visitation.error){
            this.setState({error: visitation.error});
            return;
        }
        let state = { ...this.state };
        state['visitation'] = visitation;
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
                marginRight: "10px",
                fontWeight: "bold"
            },
            entry:{
                display: "inline"
            }
        };

        const convertDoB = (dob_string) =>{
            console.log(dob_string);
            let d = new Date(dob_string);
            let dateString = d.getMonth()+1+"-"+d.getUTCDate()+"-"+d.getFullYear();
            return dateString;
        }

        let error = this.state.error ? <Alert severity="error">{this.state.error}</Alert> : "";
        let success = this.state.success ? <Alert severity="success">{this.state.success}</Alert> : "";
        let isStaffMember = this.props.user.user_type === UserType.StaffMember;

        return (
            <Container component="main" maxWidth="xs" >
                <div style={classes.paper}>
                    <Icon>medical_services</Icon>
                    <Typography component="h1" variant="h5">Visitation</Typography>
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
                            <p class="entry">{convertDoB(this.state.visitation.visitation_date)}</p>
                            <hr></hr>
                        </div>
                        <div>
                            <label style={classes.p_label}>Physician: </label>
                            <p>{this.state.visitation.physician_first} {this.state.visitation.physician_last}</p>
                            <label style={classes.p_label}>License: </label>
                            <p>{this.state.visitation.physician_state}-{this.state.visitation.license_number}</p>
                            <hr></hr>
                        </div>
                        <div>
                            <label style={classes.p_label}>Patient: </label>
                            <p>{this.state.visitation.patient_first} {this.state.visitation.patient_last}</p>
                            <label style={classes.p_label}>Date of Birth: </label>
                            <p>{convertDoB(this.state.visitation.date_of_birth)}</p>
                            <label style={classes.p_label}>Address: </label>
                            <p>{this.state.visitation.address}</p>
                            <hr></hr>
                        </div>
                        <div style={{ float: "left", clear: "right",display:"block", fontWeight: "bold"}}>Procedures: </div>
                        <div>
                            
                            <ul style={{listStyleType: "none", display: "block"}}>
                            {this.state.visitation.procedures.map(function(element,idx){
                                return <li style={{float:"left", clear: "left"}}><b>{element.procedure_id}</b> {element.name}</li>;
                            })}  
                            </ul>
                        </div>
                        <div>
                            <label style={{marginBottom: "40px", fontWeight: "bold"}}>Signature: </label>
                        </div>
                    </div>
                    : ""}
                    {isStaffMember && this.state.visitation.status == 3? 
                    <Button
                    style={classes.submit}
                    variant="contained"
                    color="primary"
                    onClick={this.sendToInsurance}>
                    Send to Insurance System
                    </Button>: ""}
                    {error}
                    {success}
                </div>
            </Container>
        );
    }


}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_login };

export default connect(mapState, mapDispatch)(ViewVisitation);