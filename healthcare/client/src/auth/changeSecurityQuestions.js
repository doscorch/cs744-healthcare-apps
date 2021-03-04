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
import { updateSecurityQuestions, getAllSecurityQuestions } from './usersService';

import { InputLabel } from '@material-ui/core';



const initState = {
    username: "",
    security_question_1: "",
    security_answer_1: "",
    security_question_2: "",
    security_answer_2: "",
    security_question_3: "",
    security_answer_3: "",
    error: "",
    success: "",
}

let menuItems = [<MenuItem key={1}>Question 1</MenuItem>];


export default class changeSecurityQuestions extends React.Component {

    state = {
        ...initState
    }

    /**
     * Called when the User clicks on the change security question button
     * 
     * @param {*} e 
     * @author Sahee Thao
     * @date 03/03/2021
     */
    changeSecurityQuestions = async (e) => {
        e.preventDefault();
        const username = this.props.location.state.username;


        if (!this.state.security_question_1) {
            this.setState({ error: 'Please select a security question 1'});
            return;
        }

        if (!this.state.security_answer_1) {
            this.setState({ error: 'Please provide a security answer 1'});
            return;
        }

        let sa1IsValid = 
        this.state.security_answer_1.match(/^[0-9a-zA-Z]+$/) && // is alphanumeric
        this.state.security_answer_1.length >= 4; // is greater or equal to 6 (in length)

        if (!sa1IsValid) {
            this.setState({ error: "Security answer 1 must be have 4 or more characters and must contain only numbers and letters!" });
            return;
        }

        if (!this.state.security_question_2) {
            this.setState({ error: 'Please select a security question 2'});
            return;
        }

        if (this.state.security_question_2 == this.state.security_question_1) {
            this.setState({ error: 'Security question 2 has already been selected in security question 1! Please change security question 2.'});
            return;
        }

        if (!this.state.security_answer_2) {
            this.setState({ error: 'Please provide a security answer 2'});
            return;
        }

        let sa2IsValid = 
        this.state.security_answer_2.match(/^[0-9a-zA-Z]+$/) && // is alphanumeric
        this.state.security_answer_2.length >= 4; // is greater or equal to 6 (in length)

        if (!sa2IsValid) {
            this.setState({ error: "Security answer 2 must be have 4 or more characters and must contain only numbers and letters!" });
            return;
        }

        if (!this.state.security_question_3) {
            this.setState({ error: 'Please select a security question 3'});
            return;
        }

        if (this.state.security_question_3 == this.state.security_question_1) {
            this.setState({ error: 'Security question 3 has already been selected in security question 1! Please change security question 3.'});
            return;
        }

        if (this.state.security_question_3 == this.state.security_question_2) {
            this.setState({ error: 'Security question 3 has already been selected in security question 2! Please change security question 3.'});
            return;
        }

        if (!this.state.security_answer_3) {
            this.setState({ error: 'Please provide a security answer 3'});
            return;
        }

        let sa3IsValid = 
        this.state.security_answer_3.match(/^[0-9a-zA-Z]+$/) && // is alphanumeric
        this.state.security_answer_3.length >= 4; // is greater or equal to 6 (in length)

        if (!sa3IsValid) {
            this.setState({ error: "Security answer 3 must be have 4 or more characters and must contain only numbers and letters!" });
            return;
        }
        // change questions and answers of user
        let res = await updateSecurityQuestions(username, 
            this.state.security_question_1, this.state.security_answer_1,
            this.state.security_question_2, this.state.security_answer_2,
            this.state.security_question_3, this.state.security_answer_3);

        if (res.msg == null) {
            this.setState({ ...initState, success: "Security questions and answers successfully changed!" });
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
    async componentDidMount() {
        if (menuItems.length == 1) {
            let securityQuestions = await getAllSecurityQuestions();
             let list = securityQuestions.data;

            menuItems = [];
            for (let i = 0; i < list.length; i++) {
                menuItems.push(<MenuItem key={list[i].question_id} value={list[i].question_id}>{list[i].question}</MenuItem>);
            }
            this.forceUpdate();
        }    
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
                                            {menuItems}
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
                                            {menuItems}
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
                                            {menuItems}
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
                            onClick={this.changeSecurityQuestions}>
                            Update Security Questions
                        </Button>
                    </form>
                    {error}
                    {success}
                </div>
            </Container>
        );
    }
}