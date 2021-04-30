import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Select, MenuItem, InputLabel } from '@material-ui/core'

import Alert from '@material-ui/lab/Alert';
import { getPatientInfoById, updatePatientInfo } from '../auth/usersService';


const initState = {
    address: "",
    date_of_birth: "",
    error: "",
    success: "",
    physician: {},
}



export default class EditPatientInfo extends React.Component {

    state = {
        ...initState
    }
    changePatientInfo = async (e) => {
        e.preventDefault();

        if (!this.state.address) {
            this.setState({ error: 'Please provide an address' });
            return;
        }
        if (!this.state.date_of_birth) {
            this.setState({ error: 'Please provide a date of birth' });
            return;
        }

        let response = await updatePatientInfo(this.props.match.params.id, this.state.address, this.state.date_of_birth);
        if(response.err){
            this.setState({ error: response.err });
        }else{
            this.setState({ success: "Update Successful", error: ""});
        }
    }

    changeForm = (e) => {
        let propName = e.target.name;
        let propValue = e.target.value;
        let state = { ...this.state };
        state[propName] = propValue;
        this.setState(state);
    }

    async componentDidMount() {
        let patient = await getPatientInfoById(this.props.match.params.id);
        console.log(patient);
        let s = {...this.state };
        s.address = patient.address;
        let date = new Date(patient.date_of_birth);
        var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getUTCDate(),
        year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        d = [year, month, day].join('-');
        s.date_of_birth = d;
        this.setState(s);
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
                    <Avatar />
                    <Typography component="h1" variant="h5">Change Patient Info</Typography>
                    <form style={classes.form} noValidate>
                    <Grid container spacing={2} justify="center">
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="address"
                                        label="Address"
                                        id="address"
                                        autoComplete="current-address"
                                        value={this.state.address}
                                        onChange={this.changeForm}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        type="date"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="date-of-birth"
                                        name="date_of_birth"
                                        label="Date of Birth"
                                        value={this.state.date_of_birth}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={this.changeForm}
                                    />
                                </Grid>
                            </Grid>
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={classes.submit}
                            onClick={this.changePatientInfo}>
                            Change Patient Info
                        </Button>
                    </form>
                    {error}
                    {success}
                </div>
            </Container>
        );
    }
}