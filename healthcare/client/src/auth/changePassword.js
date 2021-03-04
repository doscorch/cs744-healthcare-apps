import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import Alert from '@material-ui/lab/Alert';
import { updatePassword } from './usersService';


const initState = {
    password: "",
    error: "",
    success: "",
    username: "",
}



export default class ChangePassword extends React.Component {

    state = {
        ...initState
    }

    /**
     * Called when the User clicks on the register button. Posts to server/auth/register
     * 
     * @param {*} e 
     * @author Sahee Thao
     * @date 02/21/2021
     */
    changePassword = async (e) => {
        e.preventDefault();
        const username = this.props.location.state.username;

        if (!this.state.password) {
            this.setState({ error: "Please provide a password" });
            return;
        }
        // check the password bounds

        let containsSpecialChar = function (text) {
            let chars = ['~', '!', '@', '#', '$', '%', '^', '&', '*', '+'];
            for (let charI = 0; charI < chars.length; charI++) {
                if (text.includes(chars[charI])) {
                    return true;
                }
            }
            return false;
        };

        let passwordIsValid = 
        this.state.password.match(/^[0-9a-zA-Z~!@#$%^&*+]+$/) && // is alphanumeric
        this.state.password.length >= 6 && // is greater or equal to 6 (in length)
        containsSpecialChar(this.state.password); // the first character is NOT a number


        if (!passwordIsValid) {
            this.setState({ error: "The password must be have 6 or more characters, must contain only numbers and letters and the following special characters: ~!@#$%^&*+, and must start have at least one of the special characters: ~!@#$%^&*+!" });
            return;
        }
        // change password of user
        let res = await updatePassword(username, this.state.password);

        if (res.msg == null) {
            this.setState({ ...initState, success: "Password successfully changed!" });
        } else {
            this.setState({error: res.msg});
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
                    <Typography component="h1" variant="h5">Change Password</Typography>
                    <form style={classes.form} noValidate>
                        <Grid container spacing={2}>
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
                            onClick={this.changePassword}>
                            Change my password
                        </Button>
                    </form>
                    {error}
                    {success}
                </div>
            </Container>
        );
    }
}