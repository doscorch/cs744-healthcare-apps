import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';

import { loginUser } from './usersService';
import { connect } from 'react-redux';
import { app_login } from '../redux/actions/userActions';
import {getPolicyByPatientPharmacy} from '../patients/patientsService';
class Login extends React.Component {
    state = {
        username: "",
        password: "",
        error: "",
    }

    test = async(e) => {
        e.preventDefault();
        let payload = {
            prescription: {
                patient_first_name: 'Peter',
                patient_last_name: 'Parker',
                patient_date_of_birth: '1982-03-27',
                patient_address: '746 23rd Ave. New York City, NY',
              },
              medicine: {
                medicine_code: 'AB17',
                medical_name: 'Amoxicillin 50mg capsules',
                commercial_name: 'amooxicillin',
              }
        };
        let res = await getPolicyByPatientPharmacy(payload);
        console.log('payload with medicine and policy holder');
        console.log(res);

        payload = {
            prescription: {
                patient_first_name: 'Peter',
                patient_last_name: 'Parker',
                patient_date_of_birth: '1982-03-27',
                patient_address: '746 23rd Ave. New York City, NY',
              },
              medicine: {
                medicine_code: '0000', // Code is not found in insurance
                medical_name: 'Amoxicillin 50mg capsules',
                commercial_name: 'amooxicillin',
              }
        };
        res = await getPolicyByPatientPharmacy(payload);
        console.log('payload without medicine and policy holder');
        console.log(res);

        payload = {
            prescription: {
                patient_first_name: 'Ben', // name is not found in insurance
                patient_last_name: 'Parker',
                patient_date_of_birth: '1982-03-27',
                patient_address: '746 23rd Ave. New York City, NY',
              },
              medicine: {
                medicine_code: 'AB17',
                medical_name: 'Amoxicillin 50mg capsules',
                commercial_name: 'amooxicillin',
              }
        };
        res = await getPolicyByPatientPharmacy(payload);
        console.log('payload without policy holder');
        console.log(res);
    }

    login = async (e) => {
        e.preventDefault();
        // log the user in and go home
        if (!this.state.username || this.state.username === "") {
            this.setState({ error: "Username is empty" });
            return;
        }
        if (!this.state.password || this.state.password === "") {
            this.setState({ error: "Password is empty" });
            return;
        }
        let res = await loginUser(this.state.username, this.state.password);
        if (res.msg) {
            this.setState({ error: res.msg });
        }
        else {
            this.props.app_login(res.user);
            this.props.history.push('/security-question');
        }
    }

    changeForm = (e) => {
        let propName = e.target.name;
        let propValue = e.target.value;
        let state = { ...this.state };
        state[propName] = propValue;
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
                marginTop: "10px",
            },
            submit: {
                margin: "10px",
            },
        };
        let alert = this.state.error ? <Alert severity="error">{this.state.error}</Alert> : "";

        return (
            <Container component="main" maxWidth="xs">
                <div style={classes.paper}>
                    <Avatar />
                    <Typography component="h1" variant="h5">Login</Typography>
                    <form style={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            onChange={this.changeForm}
                            value={this.state.username}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={this.changeForm}
                            value={this.state.password}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={classes.submit}
                            onClick={this.login}>
                            Log In
                        </Button>
                    </form>
                    {alert}
                </div>
                <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={classes.submit}
                            onClick={this.test}>
                            Test
                        </Button>
            </Container>
        );
    }
}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_login };

export default connect(mapState, mapDispatch)(Login);