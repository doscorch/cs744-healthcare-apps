import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';

import { getUser, loginUser } from './usersService';
import { connect } from 'react-redux';
import { app_login } from '../redux/actions/userActions';
const initState = {
    answer: "answer",
    question_id: "",
    question: "Where did you go to middle school?",
    error: ""
}

export class SecurityQuestion extends React.Component{
    state = {
        ...initState
    }

    submitAnswer =  (e) => {

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

        return(
            <Container component="main" maxWidth="xs">
                <div style={classes.papper}>
                    <Typography component="h1" variant="h5">Security Question</Typography>
                    <Grid container justify="center">
                        <Typography component="h4" variant="h5">{this.state.question}</Typography>
                        <TextField 
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="answer"
                            label= "Answer"
                            id="security_answer"
                            required
                            autoFocus
                            autoComplete="auto-answer"
                            onChange={this.changeForm}
                            value={this.state.answer} />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={classes.submit}
                            onClick={this.submitAnswer}>
                            Submit
                        </Button>
                    </Grid>
                    {alert}
                </div>
            </Container>
        );
    }
}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_login };

export default connect(mapState, mapDispatch)(SecurityQuestion);