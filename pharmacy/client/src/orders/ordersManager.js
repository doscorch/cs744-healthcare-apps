import * as React from 'react';
import MaterialTable from 'material-table';
import { getOrders, patchOrder, createOrder, deleteOrder } from '../orders/ordersService';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Container } from 'react-bootstrap';
import { getPrescriptionsByOrderId } from '../prescriptions/prescriptionsService';
import { PrescriptionStatus } from '../models/prescription';

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

export default class OrderManager extends React.Component {
    state = {
        taskOrders: [],
        pendingOrders: [],
        completeOrders: [],
        allOrders: [],

        tab: 0
    }

    async componentDidMount() {
        await this.getData();
    }

    handleChange = (event, newValue) => {
        this.setState({ tab: newValue })
    };

    getData = async () => {
        return await getOrders()
            .then(orders => {
                const pendingOrders = [];
                const completeOrders = [];
                const allOrders = orders.map(o => { return { ...o, order_date: new Date(new Date(o.order_date).toDateString()) } })
                this.setState({ allOrders: allOrders });
                for (var i = 0; i < orders.length; i++) {
                    const o = allOrders[i];
                    getPrescriptionsByOrderId(o.order_id).then((prescriptions) => {
                        if (!prescriptions || prescriptions.every(p => p.order_status == PrescriptionStatus.Processed)) {
                            completeOrders.push(o);
                        }
                        else {
                            pendingOrders.push(o);
                        }
                    })
                }
                this.setState({ completeOrders, pendingOrders });
            })
    }


    render() {
        const tableRef1 = React.createRef();
        const tableRef2 = React.createRef();
        const tableRef3 = React.createRef();
        return (
            <div>
                <AppBar position="static">
                    <Tabs value={this.state.tab} onChange={this.handleChange} aria-label="order menu" style={{ backgroundColor: "lightslategrey" }}>
                        <Tab label="All" {...a11yProps(0)} />
                        <Tab label="Pending" {...a11yProps(1)} />
                        <Tab label="Processed" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
                <Container fluid className="card card-body bg-light" style={{ padding: "0" }}>
                    <TabPanel value={this.state.tab} index={0}>
                        <MaterialTable
                            tableRef={tableRef3}
                            options={{
                                sorting: true,
                                search: true,
                                paging: true,
                            }}
                            title="Orders"
                            columns={[
                                { title: 'Order date', field: 'order_date', type: "date", editable: false },
                                { title: 'Patient First Name', field: 'patient_first_name', validate: u => u.patient_first_name == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                                { title: 'Patient Last Name', field: 'patient_last_name', validate: u => u.patient_last_name == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                            ]}
                            data={this.state.allOrders}
                            actions={[
                                {
                                    icon: 'add',
                                    tooltip: 'Add Over the Counter Medicine',
                                    onClick: (event, row) => {
                                        const medicine_order_id = row.medicine_order_id;
                                        this.props.history.push("/order-add/" + medicine_order_id);
                                    }
                                },
                                {
                                    icon: 'info',
                                    tooltip: 'View Details',
                                    onClick: (event, row) => {
                                        const medicine_order_id = row.medicine_order_id;
                                        this.props.history.push("/order-details/" + medicine_order_id);
                                    }
                                },
                            ]}
                            editable={{
                                onRowAdd: newData => {
                                    return createOrder({ ...newData, order_date: new Date().toDateString(), order_id: -1 }).then(_ => this.getData())
                                },
                            }}
                        />
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={1}>
                        <MaterialTable
                            tableRef={tableRef1}
                            options={{
                                sorting: true,
                                search: true,
                                paging: true,
                            }}
                            title="Orders"
                            columns={[
                                { title: 'Order date', field: 'order_date' },
                                { title: 'Patient First Name', field: 'patient_first_name' },
                                { title: 'Patient Last Name', field: 'patient_last_name' },
                            ]}
                            data={this.state.pendingOrders}
                            actions={[
                                {
                                    icon: 'add',
                                    tooltip: 'Add Over the Counter Medicine',
                                    onClick: (event, row) => {
                                        const order_id = row.medicine_order_id;
                                        this.props.history.push("/order-add/" + order_id);
                                    }
                                },
                                {
                                    icon: 'info',
                                    tooltip: 'View Details',
                                    onClick: (event, row) => {
                                        const order_id = row.medicine_order_id;
                                        this.props.history.push("/order-details/" + order_id);
                                    }
                                },
                            ]}
                        />
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={2}>
                        <MaterialTable
                            tableRef={tableRef2}
                            options={{
                                sorting: true,
                                search: true,
                                paging: true,
                            }}
                            title="Orders"
                            columns={[
                                { title: 'Order date', field: 'order_date' },
                                { title: 'Patient First Name', field: 'patient_first_name' },
                                { title: 'Patient Last Name', field: 'patient_last_name' },
                            ]}
                            data={this.state.completeOrders}
                            actions={[
                                {
                                    icon: 'add',
                                    tooltip: 'Add Over the Counter Medicine',
                                    onClick: (event, row) => {
                                        const order_id = row.medicine_order_id;
                                        this.props.history.push("/order-add/" + order_id);
                                    }
                                },
                                {
                                    icon: 'receipt',
                                    tooltip: 'View Bill',
                                    onClick: (event, row) => {
                                        const order_id = row.medicine_order_id;
                                        this.props.history.push("/order-bill/" + order_id);
                                    }
                                },
                                {
                                    icon: 'info',
                                    tooltip: 'View Details',
                                    onClick: (event, row) => {
                                        const order_id = row.medicine_order_id;
                                        this.props.history.push("/order-details/" + order_id);
                                    }
                                },
                            ]}
                        />
                    </TabPanel>
                </Container>
            </div >

        )
    }

}
