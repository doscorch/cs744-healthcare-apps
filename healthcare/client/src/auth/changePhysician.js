import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';

import Alert from '@material-ui/lab/Alert';
import { getPhysicians, changePhysician, getPatientInfo } from './usersService';


const initState = {
    physician_id: "",
    error: "",
    success: "",
    username: "",
}

let physician_list = [<MenuItem key={1}>Physician Name</MenuItem>]

export default class ChangePhysician extends React.Component {

    state = {
        ...initState
    }
    changeForm = (e) => {
        let propName = e.target.name;
        let propValue = e.target.value;
        let state = { ...this.state };
        state[propName] = propValue;
        this.setState(state);
    }

    changePhysician = async (e) => {
        e.preventDefault();
        let result = await changePhysician(this.state.physician_id);
        let state = { ...this.state };
        state['success'] = 'Sucessfully changed physician';
        this.setState(state);
    }

    async componentDidMount() {
        
        if (physician_list.length == 1) {
            let physicians = await getPhysicians();
            let list = physicians.data;

            physician_list = [];
            for (let i = 0; i < list.length; i++) {
                physician_list.push(<MenuItem key={list[i].user_id} value={list[i].user_id}>{list[i].first_name} {list[i].last_name}</MenuItem>);
            }
            this.forceUpdate();
        }
        let patient = await getPatientInfo();
        this.setState({physician_id: patient.physician_id});
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
                    <Typography component="h1" variant="h5">Change Physician</Typography>
                    <form style={classes.form} noValidate>
                        <Grid item xs={12} spacing={3}>
                                    <InputLabel id='patient-physician-label'>Physician</InputLabel>
                                    <Select
                                        labelId="patient-physician-label"
                                        required
                                        fullWidth
                                        name="physician_id"
                                        id="physician_id"
                                        auto-complete=''
                                        value={this.state.physician_id}
                                        onChange={this.changeForm}>
                                        {physician_list}
                                    </Select>
                                </Grid>
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={classes.submit}
                            onClick={this.changePhysician}>
                            Change my physician
                        </Button>
                    </form>
                    {error}
                    {success}
                </div>
            </Container>
        );
    }
}