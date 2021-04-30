import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Select, MenuItem, InputLabel } from '@material-ui/core'

import Alert from '@material-ui/lab/Alert';
import { getPhysicianInfoById, updatePhysicianInfo } from '../auth/usersService';


const initState = {
    license_number: "",
    physician_state: "",
    error: "",
    success: "",
    physician: {},
}



export default class EditPhysicianInfo extends React.Component {

    state = {
        ...initState
    }
    changePhysicianInfo = async (e) => {
        e.preventDefault();

        if (!this.state.license_number) {
            this.setState({ error: 'Please provide a license number' });
            return;
        }
        if (!this.state.physician_state) {
            this.setState({ error: 'Please provide a physician state' });
            return;
        }

        let response = await updatePhysicianInfo(this.props.match.params.id, this.state.license_number, this.state.physician_state);
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
        let physician = await getPhysicianInfoById(this.props.match.params.id);
        console.log(physician);
        let s = {...this.state };
        s.license_number = physician.license_number;
        s.physician_state = physician.physician_state;
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
                    <Typography component="h1" variant="h5">Change Physician Info</Typography>
                    <form style={classes.form} noValidate>
                    <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <InputLabel id='register-physician-state-label'>Physician State</InputLabel>
                                    <Select
                                        labelId="register-physician-state-label"
                                        required
                                        fullWidth
                                        name="physician_state"
                                        id="register-physician-state"
                                        auto-complete='admin'
                                        value={this.state.physician_state}
                                        onChange={this.changeForm}>
                                        <MenuItem value={'AL'}>AL</MenuItem>
                                        <MenuItem value={'AK'}>AK</MenuItem>
                                        <MenuItem value={'AZ'}>AZ</MenuItem>
                                        <MenuItem value={'AR'}>AR</MenuItem>
                                        <MenuItem value={'CA'}>CA</MenuItem>
                                        <MenuItem value={'CO'}>CO</MenuItem>
                                        <MenuItem value={'CT'}>CT</MenuItem>
                                        <MenuItem value={'DE'}>DE</MenuItem>
                                        <MenuItem value={'DC'}>DC</MenuItem>
                                        <MenuItem value={'FL'}>FL</MenuItem>
                                        <MenuItem value={'GA'}>GA</MenuItem>
                                        <MenuItem value={'HI'}>HI</MenuItem>
                                        <MenuItem value={'ID'}>ID</MenuItem>
                                        <MenuItem value={'IL'}>IL</MenuItem>
                                        <MenuItem value={'IN'}>IN</MenuItem>
                                        <MenuItem value={'IA'}>IA</MenuItem>
                                        <MenuItem value={'KS'}>KS</MenuItem>
                                        <MenuItem value={'KY'}>KY</MenuItem>
                                        <MenuItem value={'LA'}>LA</MenuItem>
                                        <MenuItem value={'ME'}>ME</MenuItem>
                                        <MenuItem value={'MD'}>MD</MenuItem>
                                        <MenuItem value={'MA'}>MA</MenuItem>
                                        <MenuItem value={'MI'}>MI</MenuItem>
                                        <MenuItem value={'MN'}>MN</MenuItem>
                                        <MenuItem value={'MS'}>MS</MenuItem>
                                        <MenuItem value={'MO'}>MO</MenuItem>
                                        <MenuItem value={'MT'}>MT</MenuItem>
                                        <MenuItem value={'NE'}>NE</MenuItem>
                                        <MenuItem value={'NV'}>NV</MenuItem>
                                        <MenuItem value={'NH'}>NH</MenuItem>
                                        <MenuItem value={'NJ'}>NJ</MenuItem>
                                        <MenuItem value={'NM'}>NM</MenuItem>
                                        <MenuItem value={'NY'}>NY</MenuItem>
                                        <MenuItem value={'NC'}>ND</MenuItem>
                                        <MenuItem value={'OH'}>OH</MenuItem>
                                        <MenuItem value={'OK'}>OK</MenuItem>
                                        <MenuItem value={'OR'}>OR</MenuItem>
                                        <MenuItem value={'PA'}>PA</MenuItem>
                                        <MenuItem value={'RI'}>RI</MenuItem>
                                        <MenuItem value={'SC'}>SC</MenuItem>
                                        <MenuItem value={'SD'}>SD</MenuItem>
                                        <MenuItem value={'TN'}>TN</MenuItem>
                                        <MenuItem value={'TX'}>TX</MenuItem>
                                        <MenuItem value={'UT'}>UT</MenuItem>
                                        <MenuItem value={'VT'}>VT</MenuItem>
                                        <MenuItem value={'VA'}>VA</MenuItem>
                                        <MenuItem value={'WA'}>WA</MenuItem>
                                        <MenuItem value={'WV'}>WV</MenuItem>
                                        <MenuItem value={'WI'}>WI</MenuItem>
                                        <MenuItem value={'WY'}>WY</MenuItem>
                                        <MenuItem value={'AS'}>AS</MenuItem>
                                        <MenuItem value={'GU'}>GU</MenuItem>
                                        <MenuItem value={'MH'}>MH</MenuItem>
                                        <MenuItem value={'FM'}>FM</MenuItem>
                                        <MenuItem value={'MP'}>MP</MenuItem>
                                        <MenuItem value={'PW'}>PW</MenuItem>
                                        <MenuItem value={'PR'}>PR</MenuItem>
                                        <MenuItem value={'VI'}>VI</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={8}>
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
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            style={classes.submit}
                            onClick={this.changePhysicianInfo}>
                            Change Physician Info
                        </Button>
                    </form>
                    {error}
                    {success}
                </div>
            </Container>
        );
    }
}