import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';

import { answerSecurityQuestion } from './usersService';
import { connect } from 'react-redux';
import { app_login } from '../redux/actions/userActions';
const initState = {
    answer: "",
    question_id: "",
    question: "Where did you go to middle school?",
    attempt_number: 1,
    error: ""
}

export class SecurityQuestion extends React.Component{
    state = {
        ...initState
    }

    submitAnswer = async (e) => {
        let success = await answerSecurityQuestion(this.user, this.state.question_id, 
            this.state.answer, this.state.attempt_number);
        
        if(!success){
            //Answered incorrectly
            let next_attempt = this.state.attempt_number+1;
            if(next_attempt>3){
                this.setState({ error: "Security Questions failed: Please contact administrator."})
            }else{
                this.setState({ attempt_number: next_attempt})
            }
        }else{
            //Answered correctly
            
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