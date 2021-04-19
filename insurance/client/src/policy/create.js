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
import { Checkbox, InputLabel } from '@material-ui/core';
import { getAllDrugs, createPolicy, getAllProcedures } from './policyService';
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

let allDrugs = [];
let allProcedures = [];

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
        let decCount = function (num) {
            if (Number.isInteger(num)) return 0;
            if (num.split(".")[1] == null) return 0;
            return num.split(".")[1].length || 0;
        }

        if (isNaN(this.state.max_coverage_per_year)) {
            this.setState({ error: "Please provide a number for maximum coverage per year" });
            return;
        }

        if (decCount(this.state.max_coverage_per_year) > 2) {
            this.setState({ error: "Please provide no more than 2 decimals for maximum coverage per year" });
            return;
        }

        if (!this.state.percent_coverage) {
            this.setState({ error: "Please provide a percent of coverage" });
            return;
        }

        if (isNaN(this.state.percent_coverage)) {
            this.setState({ error: "Please provide a number for percent of coverage" });
            return;
        }


        if (!this.state.premium_per_month) {
            this.setState({ error: "Please provide a premium per month" });
            return;
        }

        if (isNaN(this.state.premium_per_month)) {
            this.setState({ error: "Please provide a number for premium per month" });
            return;
        }

        if (decCount(this.state.premium_per_month) > 2) {
            this.setState({ error: "Please provide no more than 2 decimals for premium per month" });
            return;
        }

        let selectedDrugIds = [];

        for (let i = 0; i < allDrugs.length; i++) {
            if (allDrugs[i].selected) {
                selectedDrugIds.push(allDrugs[i].drug_id);
            }
        }

        let selectedProcedureIds = [];

        for (let i = 0; i < allProcedures.length; i++) {
            if (allProcedures[i].selected) {
                selectedProcedureIds.push(allProcedures[i].procedure_id);
            }
        }
        if (selectedProcedureIds.length === 0 && selectedDrugIds.length === 0) {
            this.setState({ error: "Please add at least one drug or procedure" });
            return;
        }
        // create policy
        let res = await createPolicy(this.state.code, this.state.policy_name, this.state.age_limit, this.state.max_coverage_per_year,
            this.state.percent_coverage, this.state.premium_per_month, selectedDrugIds, selectedProcedureIds);

        if (res.data == null) {
            this.setState({ ...initState, success: "Policy successfully created!", error: '' });

            for (let i = 0; i < allDrugs.length; i++) {
                allDrugs[i].selected = false;
            }

            for (let i = 0; i < allProcedures.length; i++) {
                allProcedures[i].selected = false;
            }
            
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
        this.setState(state);
    }

    generateDrugs = () => {
        const tableRef = React.createRef();
        return (
            <div>
                <MaterialTable
                    tableRef={tableRef}
                    title=''
                    columns={[
                        { title: 'Code', field: 'drug_code'},
                        { title: 'Drug Name', field: 'drug_name' },
                        { title: 'Commercial Name', field: 'commercial_name'},
                        {
                            title: '',
                            field: '',
                            render: d => <Button value={d.drug_id} onClick={(e) => {d.selected = false; this.forceUpdate();}}>Remove</Button>
                        }
                    ]}
                    data={allDrugs.filter(function (val) {
                        return val.selected;
                    })}
                />
            </div>
        )
    }

    generateProcedures = () => {
        const tableRef = React.createRef();
        return (
            <div>
                <MaterialTable
                    tableRef={tableRef}
                    title=''
                    columns={[
                        { title: 'Code', field: 'procedure_id_hc'},
                        { title: 'Procedure Name', field: 'procedure_name' },
                        {
                            title: '',
                            field: '',
                            render: d => <Button value={d.procedure_id} onClick={(e) => {d.selected = false; this.forceUpdate();}}>Remove</Button>
                        }
                    ]}
                    data={allProcedures.filter(function (val) {
                        return val.selected;
                    })}
                />
            </div>
        )
    }
    
    generateDrugsCheckbox = () => {
        
        const tableRef = React.createRef();


        return (
            <div>
                <MaterialTable
                    tableRef={tableRef}
                    title=''
                    columns={[
                        { title: 'Code', field: 'drug_code'},
                        { title: 'Drug Name', field: 'drug_name' },
                        { title: 'Commercial Name', field: 'commercial_name'},
                        {
                            title: 'Select',
                            field: '',
                            render: d => <Checkbox key={d.drug_id} color='primary' checked={d.selected} onChange={(e) => {d.selected = !d.selected; console.log(allDrugs); this.forceUpdate();}}/>
                        }
                    ]}
                    data={allDrugs}
                />
            </div>
        )
    }

    generateProceduresCheckbox = () => {
        
        const tableRef = React.createRef();


        return (
            <div>
                <MaterialTable
                    tableRef={tableRef}
                    title=''
                    columns={[
                        { title: 'Code', field: 'procedure_id_hc'},
                        { title: 'Procedure Name', field: 'procedure_name' },
                        {
                            title: 'Select',
                            field: '',
                            render: d => <Checkbox key={d.procedure_id} color='primary' checked={d.selected} onChange={(e) => {d.selected = !d.selected; this.forceUpdate();}}/>
                        }
                    ]}
                    data={allProcedures}
                />
            </div>
        )
    }

    async componentDidMount() {
        let result = await getAllDrugs();
        allDrugs = result.data;
        for (let i = 0; i < allDrugs.length; i++) {
            allDrugs[i].selected = false;
        }

        result = await getAllProcedures();
        allProcedures = result.data;
        for (let i = 0; i < allProcedures.length; i++) {
            allProcedures[i].selected = false;
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
            <Container component="main" maxWidth="lg" >
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
                            <Grid item xs={6}>
                            <div style={classes.center}>
                                {this.generateDrugsCheckbox()}
                            </div>
                            </Grid>
                            <Grid item xs={6}>
                            <div style={classes.center}>
                                <h3>Selected Drug(s)</h3>
                                {this.generateDrugs()}
                            </div>
                            </Grid>
                            <Grid item xs={6}>
                            <div style={classes.center}>
                                {this.generateProceduresCheckbox()}
                            </div>
                            </Grid>
                            <Grid item xs={6}>
                            <div style={classes.center}>
                                <h3>Selected Procedure(s)</h3>
                                {this.generateProcedures()}
                            </div>
                            </Grid>
                            
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