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

import { getVisitation } from './visitationService';
import Icon from '@material-ui/core/Icon';
const initState = {
    visitation: {procedures:[]}
}


export class ViewBill extends React.Component {

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

    async componentDidMount() {
        const visit_id = this.props.match.params.visit;
        console.log(this.props.match.params);
        let visitation = await getVisitation(visit_id);
        console.log(visitation);
        if(visitation.error){
            this.setState({error: visitation.error});
            return;
        }
        let d = new Date(visitation.visitation_date);
        let dateString = d.getMonth()+1+"-"+d.getDate()+"-"+d.getFullYear();
        visitation.date = dateString;
        let dob = new Date(visitation.date_of_birth);
        let dobString = dob.getMonth()+1+"-"+dob.getDate()+"-"+dob.getFullYear();
        visitation.date_of_birth = dobString;
        visitation.total = 0;
        visitation.procedures.filter((element,idx) => visitation.total+= (element.price - element.insurance_pays));
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
                marginRight: "10px"
            },
            entry:{
                display: "inline"
            },
            tableEntry:{
                paddingLeft: "10px",
                paddingRight: "10px",
                paddingBottom: "10px",
                paddingTop: "10px",
                maxWidth:"550px"
            },
            table:{
                borderSpacing: "30px",
                border: "2px solid lightgray"
            },
            onRow:{
                backgroundColor: "#eee"
            },
            offRow:{
                backgroundColor: "#fff"
            },
            lastRow:{
                backgroundColor: "#ffe6e6"
            }
        };
        let error = this.state.error ? <Alert severity="error">{this.state.error}</Alert> : "";
        let success = this.state.success ? <Alert severity="success">{this.state.success}</Alert> : "";
        return (
            <div>
                <div style={{display: "flex", justifyContent:"center"}}>
                    <div>
                    <img src={process.env.PUBLIC_URL + '/logo.png'} alt="logo image" style={{ width: "100px", float: "left" }}></img>
                    <h1>Peach Healthcare</h1>
                    <h3>La Crosse, WI 54601</h3>
                    <label style={classes.p_label}>Website: </label>
                    <a href="http://138.49.101.87/peachhealthcare">138.49.101.87/peachhealthcare</a>
                    </div>
                    <div>
                        <label style={{fontWeight: "bold"}}>Date: </label>
                        <p>{this.state.visitation.date}</p>
                        <label style={{fontWeight: "bold"}}>Patient: </label>
                        <p>{this.state.visitation.patient_first} {this.state.visitation.patient_last}</p>
                        <label style={{fontWeight: "bold"}}>Physician: </label>
                        <p>{this.state.visitation.physician_first} {this.state.visitation.physician_last}</p>
                    </div>
                </div>
                <div style={{display: "flex", justifyContent:"center"}}>
                <table style={classes.table}>
                    <tr style={classes.lastRow}>
                        <th style={classes.tableEntry}>CPT Code</th>
                        <th style={classes.tableEntry}>Service</th>
                        <th style={classes.tableEntry}>Cost</th>
                        <th style={classes.tableEntry}>Insurance payment</th>
                        <th style={classes.tableEntry}>Patient pays</th>
                    </tr>
                    {this.state.visitation.procedures.map(function(element,idx){
                        let currRow = idx%2==0 ? classes.onRow : classes.offRow;
                                return <tr style={currRow}>
                                <td style={classes.tableEntry}>{element.procedure_id}</td>
                                <td style={classes.tableEntry}>{element.name}</td>
                                <td style={classes.tableEntry}>${element.price}</td>
                                <td style={classes.tableEntry}>{element.insurance_pays? "$"+element.insurance_pays : "$0.00"}</td>
                                <td style={classes.tableEntry}>${element.price - element.insurance_pays}</td>
                            </tr>;
                        })}
                    
                    <tr style={classes.lastRow}>
                        <td style={classes.tableEntry}></td>
                        <td style={classes.tableEntry}></td>
                        <td style={classes.tableEntry}></td>
                        <td style={classes.tableEntry}>Total</td>
                        <td style={classes.tableEntry}>${this.state.visitation.total}</td>
                    </tr>
                </table>
                </div>
            </div>
        );
    }


}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_login };

export default connect(mapState, mapDispatch)(ViewBill);