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

import { registerUser } from './usersService';
import { InputLabel } from '@material-ui/core';
const initState = {
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    user_type: "",
    date_of_birth: "",
    address: "",
    license_number: "",
    security_question_1: "",
    security_answer_1: "",
    security_question_2: "",
    security_answer_2: "",
    security_question_3: "",
    security_answer_3: "",
    error: "",
    success: ""
}

export default class Register extends React.Component {

    state = {
        ...initState
    }

    registerUser = async (e) => {
        e.preventDefault();
        // error handling
        if (!this.state.username) {
            this.setState({ error: "please provide username" })
            return;
        }
        if (!this.state.password) {
            this.setState({ error: "please provide password" })
            return;
        }

        // register user
        await registerUser(this.state.username, this.state.password, this.state.first_name, this.state.last_name, this.state.user_type, 
            this.state.security_answer_1, this.state.security_answer_2, this.state.security_answer_3, this.state.security_question_1, 
            this.state.security_question_2,this.state.security_question_3, this.state.address, this.state.date_of_birth, this.state.license_number)
        this.setState({ ...initState, success: "user successfully created.. please login" });
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
                marginTop: "10px"
            },
            submit: {
                margin: "10px"
            },
        };
        let error = this.state.error ? <Alert severity="error">{this.state.error}</Alert> : "";
        let success = this.state.success ? <Alert severity="success">{this.state.success}</Alert> : "";

        const isPatient = this.state.user_type === 'patient';
        const isPhysician = this.state.user_type === 'physician';

        return (
            <Container component="main" maxWidth="xs" >
                <div style={classes.paper}>
                    <Avatar />
                    <Typography component="h1" variant="h5">Register</Typography>
                    <form style={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="fname"
                                    name="first_name"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="first_name"
                                    label="First Name"
                                    autoFocus
                                    value={this.state.first_name}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="last_name"
                                    label="Last Name"
                                    name="last_name"
                                    autoComplete="lname"
                                    value={this.state.last_name}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    value={this.state.username}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={this.state.password}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                        </Grid>
                        <Grid container justify="center" spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <InputLabel id='register-user-type-label'>User Type</InputLabel>
                                <Select 
                                    labelId="register-user-type-label"
                                    required
                                    fullWidth
                                    name="user_type"
                                    id="register-user-type"
                                    auto-complete='admin'
                                    value={this.state.user_type}
                                    onChange={this.changeForm}>
                                        <MenuItem value={'admin'}>Admin</MenuItem>
                                        <MenuItem value={'patient'}>Patient</MenuItem>
                                        <MenuItem value={'physician'}>Physician</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                        {isPatient ? 
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
                                        label="Date of Birth"
                                        value={this.state.date_of_birth}
                                        InputLabelProps={{
                                            shrink: true,
                                            }}
                                        onChange={this.changeForm}
                                    />
                                </Grid>
                            </Grid>
                        : ""}
                        {isPhysician ? 
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="license_number"
                                    label="License Number"
                                    id="license_number"
                                    autoComplete="current-number"
                                    value={this.state.license_number}
                                    onChange={this.changeForm}
                                    />
                                </Grid>
                            </Grid>
                        : ""}

                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <InputLabel id='sq1-user-type-label'>Security Question 1</InputLabel>
                                    <Select 
                                        labelId="sq1-user-type-label"
                                        required
                                        fullWidth
                                        name="security_question_1"
                                        id="security_question_1"
                                        auto-complete='sq1'
                                        value={this.state.security_question_1}
                                        onChange={this.changeForm}>
                                            <MenuItem value={1}>Question 1</MenuItem>
                                            <MenuItem value={2}>Question 2</MenuItem>
                                            <MenuItem value={3}>Question 3</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="security_answer_1"
                                    label="Security Question 1 Answer"
                                    id="security_answer_1"
                                    autoComplete="current-sa1"
                                    value={this.state.security_answer_1}
                                    onChange={this.changeForm}
                                    />
                            </Grid>
                        </Grid>

                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <InputLabel id='sq2-user-type-label'>Security Question 2</InputLabel>
                                    <Select 
                                        labelId="sq2-user-type-label"
                                        required
                                        fullWidth
                                        name="security_question_2"
                                        id="security_question_2"
                                        auto-complete='sq2'
                                        value={this.state.security_question_2}
                                        onChange={this.changeForm}>
                                            <MenuItem value={1}>Question 1</MenuItem>
                                            <MenuItem value={2}>Question 2</MenuItem>
                                            <MenuItem value={3}>Question 3</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="security_answer_2"
                                    label="Security Question 2 Answer"
                                    id="security_answer_2"
                                    autoComplete="current-sa2"
                                    value={this.state.security_answer_2}
                                    onChange={this.changeForm}
                                    />
                            </Grid>
                        </Grid>

                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <InputLabel id='sq3-user-type-label'>Security Question 3</InputLabel>
                                    <Select 
                                        labelId="sq3-user-type-label"
                                        required
                                        fullWidth
                                        name="security_question_3"
                                        id="security_question_3"
                                        auto-complete='sq3'
                                        value={this.state.security_question_3}
                                        onChange={this.changeForm}>
                                            <MenuItem value={1}>Question 1</MenuItem>
                                            <MenuItem value={2}>Question 2</MenuItem>
                                            <MenuItem value={3}>Question 3</MenuItem>
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="security_answer_3"
                                    label="Security Question 3 Answer"
                                    id="security_answer_3"
                                    autoComplete="current-sa3"
                                    value={this.state.security_answer_3}
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
                            onClick={this.registerUser}>
                            Register
                        </Button>
                        <Grid container justify="center">
                            <Grid item>
                                <Link href="/login">
                                    Already have an account? Login
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                    {error}
                    {success}
                </div>
            </Container>
        );
    }
}