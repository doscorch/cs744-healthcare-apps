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
import MaterialTable from 'material-table';


// import { registerUser, getAllSecurityQuestions } from './usersService';
import { InputLabel } from '@material-ui/core';
import { getAllDrugs, createPolicy } from './policyService';
const initState = {
    code: '',
    policy_name: '',
    age_limit: '',
    max_coverage_per_year: '',
    percent_coverage: '',
    premium_per_month: '',
    drug: '',
    error: '',
    success: '',
    questions: null,
}

let drugMenuItems = [<MenuItem key={1}>Drug</MenuItem>];
let fullDrugMenuItems = [];
let selectedDrugs = [];
let selectedDrugIds = [];
export default class CreatePolicy extends React.Component {

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
    createPolicy = async (e) => {

        e.preventDefault();
        console.log('CREATE');
        // error handling
        if (!this.state.code) {
            this.setState({ error: "Please provide a code" });
            return;
        }

        if (!this.state.policy_name) {
            this.setState({ error: "Please provide a name" });
            return;
        }

        if (!this.state.age_limit) {
            this.setState({ error: "Please provide an age limit" });
            return;
        }

        if (!Number.isInteger(+this.state.age_limit)) {
            this.setState({ error: "Please provide an integer age limit" });
            return;
        }

        if (!this.state.max_coverage_per_year) {
            this.setState({ error: "Please provide a maximum coverage per year" });
            return;
        }
        Number.prototype.countDecimals = function () {
            if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
            return this.toString().split(".")[1].length || 0;
        }
        if (Number.isNaN(this.state.max_coverage_per_year)) {
            this.setState({ error: "Please provide a number for maximum coverage per year" });
            return;
        }

        if (this.state.max_coverage_per_year.countDecimals > 2) {
            this.setState({ error: "Please provide no more than 2 decimals for maximum coverage per year" });
            return;
        }

        if (!this.state.percent_coverage) {
            this.setState({ error: "Please provide a percent of coverage" });
            return;
        }

        if (Number.isNaN(this.state.percent_coverage)) {
            this.setState({ error: "Please provide a number for percent od coverage" });
            return;
        }


        if (!this.state.premium_per_month) {
            this.setState({ error: "Please provide a premium per month" });
            return;
        }

        if (Number.isNaN(this.state.premium_per_month)) {
            this.setState({ error: "Please provide a number for premium per month" });
            return;
        }

        if (this.state.premium_per_month.countDecimals > 2) {
            this.setState({ error: "Please provide no more than 2 decimals for premium per month" });
            return;
        }

        if (selectedDrugIds.length === 0) {
            this.setState({ error: "Please add at least one drug" });
            return;
        }

        // create policy
        let res = await createPolicy(this.state.code, this.state.policy_name, this.state.age_limit, this.state.max_coverage_per_year,
            this.state.percent_coverage, this.state.premium_per_month, selectedDrugIds);

        if (res.data == null) {
            this.setState({ ...initState, success: "Policy successfully created!" });
            drugMenuItems = [];
            selectedDrugs = [];
            selectedDrugIds = [];
            this.forceUpdate();
        } else {
            this.setState({ error: res.data });
        }
    }

    addDrug = (e) => {
        e.preventDefault();
        if (!this.state.drug) {
            this.setState({ error: "Please select a drug" });
            return;
        }

        selectedDrugIds.push(this.state.drug.drug_id);
        selectedDrugs.push(this.state.drug);

        let cur = [];

        for (let i = 0; i < fullDrugMenuItems.length; i++) {
            let key = fullDrugMenuItems[i].key;
            if (selectedDrugIds.includes(Number.parseInt(key))) {
                console.log('key ' + key + 'in ids');
            } else {
                cur.push(fullDrugMenuItems[i]);
            }
        }


        drugMenuItems = cur;
        this.forceUpdate();
    }

    changeForm = (e) => {
        let propName = e.target.name;
        let propValue = e.target.value;
        let state = { ...this.state };
        state[propName] = propValue;
        this.setState(state);
    }

    deleteDrug = (e) => {
        e.preventDefault();
        let id = e.currentTarget.value;
        selectedDrugIds = selectedDrugIds.filter(function (val) {
            return val != id;
        });

        selectedDrugs = selectedDrugs.filter(function (val) {
            return val.drug_id != id;
        });

        let cur = [];

        for (let i = 0; i < fullDrugMenuItems.length; i++) {
            let key = fullDrugMenuItems[i].key;
            if (selectedDrugIds.includes(Number.parseInt(key))) {
                console.log('key ' + key + 'in ids');
            } else {
                cur.push(fullDrugMenuItems[i]);
            }
        }


        drugMenuItems = cur;
        this.forceUpdate();
    }

    generateDrugs = () => {
        const tableRef = React.createRef();
        return (
            <div>
                <MaterialTable
                    tableRef={tableRef}
                    title=''
                    columns={[
                        { title: 'Drug Name', field: 'drug_name' },
                        {
                            title: '',
                            field: '',
                            render: d => <Button value={d.drug_id} onClick={this.deleteDrug}>Remove</Button>
                        }
                    ]}
                    data={selectedDrugs}
                />
            </div>
        )
    }

    async componentDidMount() {
        let result = await getAllDrugs();
        let data = result.data;
        fullDrugMenuItems = [];
        for (let i = 0; i < data.length; i++) {
            fullDrugMenuItems.push(<MenuItem key={data[i].drug_id} value={{ drug_name: data[i].drug_name, drug_id: data[i].drug_id }}>{data[i].drug_name}</MenuItem>);
        }
        drugMenuItems = fullDrugMenuItems;
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

                    <Typography component="h1" variant="h5">Create Policy</Typography>
                    <form style={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="code"
                                    name="code"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="code"
                                    label="Code"
                                    autoFocus
                                    required
                                    value={this.state.code}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="policyName"
                                    name="policy_name"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="policy_name"
                                    label="Name"
                                    autoFocus
                                    required
                                    value={this.state.policy_name}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="age_limit"
                                    label="Age Limit"
                                    name="age_limit"
                                    autoComplete="agelimit"
                                    value={this.state.age_limit}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="max_coverage_per_year"
                                    label="Max Coverage per Year"
                                    name="max_coverage_per_year"
                                    autoComplete="maxCoveragePerYear"
                                    value={this.state.max_coverage_per_year}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="percent_coverage"
                                    label="Percent of Coverage"
                                    name="percent_coverage"
                                    autoComplete="perCov"
                                    value={this.state.percent_coverage}
                                    onChange={this.changeForm}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="premium_per_month"
                                    label="Premium per Month"
                                    name="premium_per_month"
                                    autoComplete="premiumPerMonth"
                                    value={this.state.premium_per_month}
                                    onChange={this.changeForm}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <InputLabel id='sq1-user-type-label'>Drugs</InputLabel>
                                <Select
                                    labelId="sq1-user-type-label"
                                    required
                                    fullWidth
                                    name="drug"
                                    id="drug"
                                    auto-complete='sq1'
                                    value={this.state.drug}
                                    onChange={this.changeForm}>
                                    {drugMenuItems}
                                </Select>
                            </Grid>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                style={classes.submit}
                                onClick={this.addDrug}>
                                Add Drug
                            </Button>

                            <div style={classes.center}>
                                {this.generateDrugs()}
                            </div>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                style={classes.submit}
                                onClick={this.createPolicy}>
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