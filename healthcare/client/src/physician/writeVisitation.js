import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Select from '@material-ui/core/Select';
import CheckBox from '@material-ui/core/CheckBox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MaterialTable from 'material-table';
import Alert from '@material-ui/lab/Alert';
import { Row, Col, Card } from 'react-bootstrap';

import { connect } from 'react-redux';
import { app_login } from '../redux/actions/userActions';

import { getPhysician, getPatient, saveVisitation, getProcedures } from './physicianService';
import Icon from '@material-ui/core/Icon';
const initState = {
    procedures: [],
    selected_procedures: []
}


export class WriteVisitation extends React.Component {

    state = {
        ...initState,
        physician: "",
        patient: "",
        error: "",
        success: "",
        require_prescription: false
    }

    changeForm = (e) => {
        let propName = e.target.name;
        let propValue = e.target.value;
        let state = { ...this.state };
        state[propName] = propValue;
        this.setState(state);
    }

    saveVisitationClick = async () =>{
        if(this.state.selected_procedures.length == 0){
            this.setState({error: "Please select at least one procedure"});
            return;
        }
        let response = await saveVisitation(this.state.physician, this.state.patient, this.state.selected_procedures);
        if(response.error){
            this.setState({error: response.error});
            return;
        }
        this.setState({success: "Visitation saved"})
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

        const procedures = await getProcedures();
        if(procedures.err){
            let state = { ...this.state };
            state['error'] = procedures.err;
            this.setState(state);
        }
        

        let state = { ...this.state };
        state['patient'] = patient;
        state['physician'] = physician;
        state['procedures'] = procedures;
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
        const tableRef = React.createRef();

        return (
            <div style={{ alignItems: 'center' }}>
            <Container component="main" maxWidth="xs" >
                <div style={classes.paper}>
                    <Icon>medical_services</Icon>
                    <Typography component="h1" variant="h5">Medical Visitaiton</Typography>
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
                        <FormControlLabel style={{ padding: "10px", marginLeft:'auto', marginRight:'auto', marginTop:'10px',marginBottom:'10px'}}
                        control={<CheckBox checked={this.state.require_prescription} onChange={(e) =>{
                            let newCheck = !this.state.require_prescription;
                            this.setState({require_prescription: newCheck});
                        }} name="require_prescription" />}
                        label="Prescription Required"
                    />
                        {error}
                    {success}
                    <Button
                            style={classes.submit}
                            type="submit"
                            variant="contained"
                            color="primary"
                            onClick={this.saveVisitationClick}>
                            Save Visitation
                        </Button>
                        </div>
            </Container>
                        <MaterialTable style={{ padding: "10px", width: "75%", marginLeft:'auto', marginRight:'auto'}}
                            tableRef={tableRef}
                            options={{
                                selection: true
                            }}
                            title="Procedures"
                            columns={[
                                // { title: 'Id', field: '_id' },
                                { title: 'Procedure Code', field: 'procedure_id', validate: u => u.procedure_id == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                                { title: 'Procedure Name', field: 'name', validate: u => u.name == "" ? { isValid: false, helperText: "required" } : { isValid: true } }
                            ]}
                            data={this.state.procedures}
                            onSelectionChange={async (rows) => {
                                await this.setState({selected_procedures: rows});
                                console.log(this.state.selected_procedures);
                            }}
                        />
                        
            </div>
                
        );
    }


}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_login };

export default connect(mapState, mapDispatch)(WriteVisitation);