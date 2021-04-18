import * as React from 'react';
import MaterialTable from 'material-table';
import { getPrescriptions, patchPrescription, createPrescription, deletePrescription } from './prescriptionsService';
import { PrescriptionStatus } from '../models/prescription';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Container } from 'react-bootstrap';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default class PrescriptionManager extends React.Component {
    state = {
        taskPrescriptions: [],
        pendingPrescriptions: [],
        completePrescriptions: [],
        allPrescriptions: [],

        tab: 0
    }

    componentDidMount() {
        this.getData();
    }

    handleChange = (event, newValue) => {
        this.setState({ tab: newValue })
    };

    getData = () => {
        return getPrescriptions()
            .then(prescriptions => {
                const taskPrescriptions = prescriptions.filter(p => p.order_status == PrescriptionStatus.Ready || p.order_status == PrescriptionStatus.Verified_Patient || p.order_status == PrescriptionStatus.Verified_Physician || p.order_status == PrescriptionStatus.Verified_Physician);
                const pendingPrescriptions = prescriptions.filter(p => p.order_status == PrescriptionStatus.Pending_Insurance);
                const completePrescriptions = prescriptions.filter(p => p.order_status == PrescriptionStatus.Processed);
                this.setState({ taskPrescriptions, pendingPrescriptions, completePrescriptions, allPrescriptions: prescriptions })
            })
    }

    render() {
        const tableRef1 = React.createRef();
        const tableRef2 = React.createRef();
        const tableRef3 = React.createRef();
        const tableRef4 = React.createRef();
        return (
            <div>
                <AppBar position="static">
                    <Tabs value={this.state.tab} onChange={this.handleChange} aria-label="prescription menu" style={{ backgroundColor: "lightslategrey" }}>
                        <Tab label="Tasks" {...a11yProps(0)} />
                        <Tab label="Pending" {...a11yProps(1)} />
                        <Tab label="Complete" {...a11yProps(2)} />
                        <Tab label="All" {...a11yProps(3)} />
                    </Tabs>
                </AppBar>
                <Container fluid className="card card-body bg-light" style={{ padding: "0" }}>
                    <TabPanel value={this.state.tab} index={0}>
                        <MaterialTable
                            tableRef={tableRef1}
                            options={{
                                sorting: true,
                                search: true,
                                paging: true,
                            }}
                            title="Prescriptions"
                            columns={[
                                { title: 'Order date', field: 'order_date' },
                                { title: 'Patient name', render: p => (p.patient_first_name + " " + p.patient_last_name) },
                                { title: 'Prescription', field: 'prescription' },
                                { title: 'Status', render: p => (PrescriptionStatus.GetTranslation(p.order_status)) },
                            ]}
                            data={this.state.taskPrescriptions}
                            actions={[
                                {
                                    icon: 'task_alt',
                                    tooltip: 'Process',
                                    onClick: (event, row) => {
                                        const prescription_id = row.prescription_id;
                                        switch (row.order_status) {
                                            case PrescriptionStatus.Ready:
                                                this.props.history.push("/verify-patient/" + prescription_id);
                                                break;
                                            case PrescriptionStatus.Verified_Patient:
                                                this.props.history.push("/verify-physician/" + prescription_id);
                                                break;
                                            case PrescriptionStatus.Verified_Physician:
                                                this.props.history.push("/fill-prescription/" + prescription_id);
                                                break;
                                            case PrescriptionStatus.Filled:
                                                this.props.history.push("/verify-insurance-request/" + prescription_id);
                                                break;
                                            default:
                                                console.log('unknown prescription status');
                                        }
                                    }
                                },
                                {
                                    icon: 'info',
                                    tooltip: 'View Details',
                                    onClick: (event, row) => {
                                        const prescription_id = row.prescription_id;
                                        this.props.history.push("/prescription-details/" + prescription_id);
                                    }
                                },
                                // {
                                //     icon: 'file_copy',
                                //     tooltip: 'View Prescription',
                                //     onClick: (event, row) => {
                                //         const prescription_id = row.prescription_id;
                                //         this.props.history.push("/prescriptions/" + prescription_id);
                                //     }
                                // },
                            ]}
                        />
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={1}>
                        <MaterialTable
                            tableRef={tableRef2}
                            options={{
                                sorting: true,
                                search: true,
                                paging: true,
                            }}
                            title="Prescriptions"
                            columns={[
                                { title: 'Order date', field: 'order_date' },
                                { title: 'Patient name', render: p => (p.patient_first_name + " " + p.patient_last_name) },
                                { title: 'Prescription', field: 'prescription' },
                                { title: 'Status', render: p => (PrescriptionStatus.GetTranslation(p.order_status)) },
                            ]}
                            data={this.state.pendingPrescriptions}
                            actions={[
                                {
                                    icon: 'info',
                                    tooltip: 'View Details',
                                    onClick: (event, row) => {
                                        const prescription_id = row.prescription_id;
                                        this.props.history.push("/prescription-details/" + prescription_id);
                                    }
                                },
                                // {
                                //     icon: 'file_copy',
                                //     tooltip: 'View Prescription',
                                //     onClick: (event, row) => {
                                //         const prescription_id = row.prescription_id;
                                //         this.props.history.push("/prescriptions/" + prescription_id);
                                //     }
                                // },
                            ]}
                        />
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={2}>
                        <MaterialTable
                            tableRef={tableRef3}
                            options={{
                                sorting: true,
                                search: true,
                                paging: true,
                            }}
                            title="Prescriptions"
                            columns={[
                                { title: 'Order date', field: 'order_date' },
                                { title: 'Patient name', render: p => (p.patient_first_name + " " + p.patient_last_name) },
                                { title: 'Prescription', field: 'prescription' },
                                { title: 'Status', render: p => (PrescriptionStatus.GetTranslation(p.order_status)) },
                            ]}
                            data={this.state.completePrescriptions}
                            actions={[
                                {
                                    icon: 'receipt',
                                    tooltip: 'View Bill',
                                    onClick: (event, row) => {
                                        const prescription_id = row.prescription_id;
                                        this.props.history.push("/prescription-bill/" + prescription_id);
                                    }
                                },
                                {
                                    icon: 'info',
                                    tooltip: 'View Details',
                                    onClick: (event, row) => {
                                        const prescription_id = row.prescription_id;
                                        this.props.history.push("/prescription-details/" + prescription_id);
                                    }
                                },
                                // {
                                //     icon: 'file_copy',
                                //     tooltip: 'View Prescription',
                                //     onClick: (event, row) => {
                                //         const prescription_id = row.prescription_id;
                                //         this.props.history.push("/prescriptions/" + prescription_id);
                                //     }
                                // },
                            ]}
                        />
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={3}>
                        <MaterialTable
                            tableRef={tableRef4}
                            options={{
                                sorting: true,
                                search: true,
                                paging: true,
                            }}
                            title="Prescriptions"
                            columns={[
                                { title: 'Order date', field: 'order_date' },
                                { title: 'Patient name', render: p => (p.patient_first_name + " " + p.patient_last_name) },
                                { title: 'Prescription', field: 'prescription' },
                                { title: 'Status', render: p => (PrescriptionStatus.GetTranslation(p.order_status)) },
                            ]}
                            data={this.state.allPrescriptions}
                            actions={[
                                {
                                    icon: 'info',
                                    tooltip: 'View Details',
                                    onClick: (event, row) => {
                                        const prescription_id = row.prescription_id;
                                        this.props.history.push("/prescription-details/" + prescription_id);
                                    }
                                },
                                // {
                                //     icon: 'file_copy',
                                //     tooltip: 'View Prescription',
                                //     onClick: (event, row) => {
                                //         const prescription_id = row.prescription_id;
                                //         this.props.history.push("/prescriptions/" + prescription_id);
                                //     }
                                // },
                            ]}
                        />
                    </TabPanel>
                </Container>
            </div >

        )
    }

}
