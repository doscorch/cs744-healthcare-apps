import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';

import { answerSecurityQuestion, getQuestions } from './usersService';
import { connect } from 'react-redux';
import { app_login } from '../redux/actions/userActions';
const initState = {
    answer: "",
    error: ""
}

const shuffle = (array) => {
    let newOrder = new Array();
    while(array.length>0){
        const idx = Math.floor(Math.random()*(array.length));
        newOrder.push(array[idx]);
        array.splice(idx, 1)
    }
    return newOrder;
}

export class SecurityQuestion extends React.Component{
    state = {
        ...initState
    }

    submitAnswer = async (e) => {
        let response = await answerSecurityQuestion(this.props.user, this.state.answer);

        if(response.msg){
            this.setState({ error: response.msg});
        }

        this.props.app_login(response.user);
        
        if(!response.correct){
            //Answered incorrectly
            console.log("Incorrect");
        }else{
            //Answered correctly
            console.log('Correct');
            this.props.history.push("/");
        }
    }

    changeForm = (e) => {
        let propName = e.target.name;
        let propValue = e.target.value;
        let state = { ...this.state };
        state[propName] = propValue;
        this.setState(state);
    }

    /*async componentDidMount(){
        let questions = await getQuestions(this.props.user);
        let state = { ...this.state };
        state.questions = shuffle(questions);
        this.setState(state);
    }*/

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
                    {this.props.user.answer_attempt<=3? 
                        <Grid container justify="center">
                            <Typography component="h4" variant="h5">{this.props.user.questions[this.props.user.answer_attempt-1].question}</Typography>
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
                        </Grid>: ""}
                    
                    {alert}
                </div>
            </Container>
        );
    }
}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_login };

export default connect(mapState, mapDispatch)(SecurityQuestion);