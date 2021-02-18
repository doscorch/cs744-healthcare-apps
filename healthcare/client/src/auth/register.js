import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';

import { registerUser } from './usersService';
const initState = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
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
        await registerUser(this.state.username, this.state.password, this.state.firstName, this.state.lastName)
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
                                    name="firstName"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    value={this.state.firstName}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="lname"
                                    value={this.state.lastName}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="username"
                                    label="username"
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