import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Alert from '@material-ui/lab/Alert';
import { InputLabel } from '@material-ui/core';
import {getAllPolicies} from '../policy/policyService';
import {createPolicyHolder} from './policyHolderService';

const initState = {
    first_name: '',
    last_name: '',
    date_of_birth: '',
    address: '',
    policy: '',
    start_date: '',
    end_date: '',
    amount_paid: '',
    amount_remaining: '',
    error: '',
    success: ''
}

let policyMenuItems = [<MenuItem key={-1}>Policy</MenuItem>];
export default class CreatePolicyHolder extends React.Component {

    state = {
        ...initState
    }

    /**
     * 
     * @param {*} e 
     * @author Sahee Thao
     * @date 02/21/2021
     */
     createPolicyHolder = async (e) => {

        e.preventDefault();
        console.log('CREATE');
        // error handling
        if (!this.state.first_name) {
            this.setState({ error: "Please provide a first name" });
            return;
        }

        if (!this.state.last_name) {
            this.setState({ error: "Please provide a last name" });
            return;
        }

        if (!this.state.date_of_birth) {
            this.setState({ error: "Please provide a date of birth" });
            return;
        }

        if (!this.state.address) {
            this.setState({ error: "Please provide an address" });
            return;
        }

        if (!this.state.policy) {
            this.setState({ error: "Please select a policy" });
            return;
        }
        let parts = this.state.date_of_birth.split('-');
        // January - 0, February - 1, etc.
        let birthday = new Date(parts[0], parts[1] - 1, parts[2]); 

        let curDate = new Date();

        let diff = new Date(curDate.getTime() - birthday.getTime());
        // diff is: Thu Jul 05 1973 04:00:00 GMT+0300 (EEST)

        let years = diff.getUTCFullYear() - 1970;
        
        if (years > this.state.policy.age_limit) {
            this.setState({ error: "This policy holder is too old for this policy!" });
            return;
        }

        if (!this.state.start_date) {
            this.setState({ error: "Please provide a start date" });
            return;
        }

        if (!this.state.end_date) {
            this.setState({ error: "Please provide an end date" });
            return;
        }
        
        if (!this.state.amount_paid) {
            this.setState({ error: "Please provide an amount paid" });
            return;
        }
        let decCount = function (num) {
            if (Number.isInteger(+num)) return 0;
            if (num.split(".")[1] == null) return 0;
            return num.split(".")[1].length || 0;
        }
        if (isNaN(this.state.amount_paid)) {
            this.setState({ error: "Please provide a number for amount paid" });
            return;
        }

        if (decCount(this.state.amount_paid) > 2) {
            this.setState({ error: "Please provide no more than 2 decimals for amount paid" });
            return;
        }

        if (!this.state.amount_remaining) {
            this.setState({ error: "Please provide an amount remaining" });
            return;
        }

        if (isNaN(this.state.amount_remaining)) {
            this.setState({ error: "Please provide a number for amount remaining" });
            return;
        }

        if (decCount(this.state.amount_remaining) > 2) {
            this.setState({ error: "Please provide no more than 2 decimals for amount remaining" });
            return;
        }

        // create policy holder
        let res = await createPolicyHolder(
            this.state.first_name,
            this.state.last_name,
            this.state.date_of_birth,
            this.state.address,
            this.state.policy.policy_id,
            this.state.start_date,
    
            this.state.end_date,
            this.state.amount_paid,
            this.state.amount_remaining);

        if (res.data == null) {
            this.setState({ ...initState, success: "Policy holder successfully created!" });
            this.forceUpdate();
        } else {
            this.setState({ error: res.data });
        }
    }

    changeForm = (e) => {
        let propName = e.target.name;
        let propValue = e.target.value;
        let state = { ...this.state };
        state[propName] = propValue;

        if (propName == 'policy') {
            state['amount_paid'] = 0;
            state['amount_remaining'] = propValue.max_coverage_per_year;
        }

        this.setState(state);
    }

    async componentDidMount() {
        let result = await getAllPolicies();
        let data = result.data;
        console.log(result.data);
        policyMenuItems = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].policy_status == 1) {
                policyMenuItems.push(<MenuItem key={data[i].policy_id} value={data[i]}>{data[i].code}</MenuItem>);
            }
        }
        this.forceUpdate();
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
            center: {
                margin: 'auto'
            }
        };
        let error = this.state.error ? <Alert severity="error">{this.state.error}</Alert> : "";
        let success = this.state.success ? <Alert severity="success">{this.state.success}</Alert> : "";

        return (
            <Container component="main" maxWidth="xs" >
                <div style={classes.paper}>

                    <Typography component="h1" variant="h5">Create Policy Holder</Typography>
                    <form style={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="firstName"
                                    name="first_name"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="first_name"
                                    label="First Name"
                                    autoFocus
                                    required
                                    value={this.state.first_name}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="lastName"
                                    name="last_name"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="last_name"
                                    label="Last Name"
                                    required
                                    value={this.state.last_name}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="date_of_birth"
                                    label="Date of Birth"
                                    name="date_of_birth"
                                    autoComplete="dob"
                                    type="date"
                                    format="MM/dd/yyyy"
    
                                    InputLabelProps={{
                                        shrink: true,
                                     }}
                                    value={this.state.date_of_birth}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="address"
                                    label="Address"
                                    name="address"
                                    autoComplete="address"
                                    value={this.state.address}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel id='sq1-user-type-label'>Policy Code</InputLabel>
                                <Select
                                    labelId="sq1-user-type-label"
                                    required
                                    fullWidth
                                    name="policy"
                                    id="policy"
                                    auto-complete='policy'
                                    value={this.state.policy}
                                    onChange={this.changeForm}>
                                    {policyMenuItems}
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    type="date"
                                    id="start_date"
                                    label="Start Date"
                                    name="start_date"
                                    format="MM/dd/yyyy"
    
                                    InputLabelProps={{
                                        shrink: true,
                                     }}
                                    autoComplete="startDate"
                                    value={this.state.start_date}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    type="date"
                                    id="end_date"
                                    label="End Date"
                                    name="end_date"
                                    format="MM/dd/yyyy"
    
                                    InputLabelProps={{
                                        shrink: true,
                                     }}
                                    autoComplete="endDate"
                                    value={this.state.end_date}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="amount_paid"
                                    label="Amount Paid"
                                    name="amount_paid"
                                    autoComplete="amountPaid"
                                    value={this.state.amount_paid}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="amount_remaining"
                                    label="Amount Remaining"
                                    name="amount_remaining"
                                    autoComplete="amountRemaining"
                                    value={this.state.amount_remaining}
                                    onChange={this.changeForm}
                                />
                            </Grid>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                style={classes.submit}
                                onClick={this.createPolicyHolder}>
                                Create
                            </Button>
                        </Grid>


                    </form>
                    {error}
                    {success}
                </div>
            </Container>
        );
    }
}