import * as React from 'react';
import MaterialTable from 'material-table';
import { Select, MenuItem } from '@material-ui/core'
import { UserType, UserStatus } from '../models/user';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {getAllPolicyHolders} from './policyHolderService';

export default class PolicyHolderManagerNew extends React.Component {
    state = {
        policyHolders: []
    }

    async componentDidMount() {
        let result = await getAllPolicyHolders();
        let policyHolders = result.data;

        // format date
        for (let i = 0; i < policyHolders.length; i++) {
            policyHolders[i]['date_of_birth'] = policyHolders[i]['date_of_birth'].split('T')[0];
            policyHolders[i]['start_date'] = policyHolders[i]['start_date'].split('T')[0];
            policyHolders[i]['end_date'] = policyHolders[i]['end_date'].split('T')[0];
        }

        this.setState({ policyHolders: policyHolders });

    }

    translateStatus(status) {
        if (status === 1) {
          return 'Active';
        } else {
          return 'Inactive';
        } 
    }

    render() {
        const tableRef = React.createRef();
        return (
            <div>
                {<Nav.Link as={Link} to="/policy-holder/create"><i className="fas fa-plus"></i> Create Policy Holder</Nav.Link>}
                <MaterialTable
                    tableRef={tableRef}
                    options={{
                        sorting: true,
                        search: true,
                        paging: false,
                    }}
                    title="Policy Holders"
                    columns={[
                        { title: 'First Name', field: 'first_name' },
                        { title: 'Last Name', field: 'last_name' },
                        { title: 'Date of Birth', field: 'date_of_birth'},
                        { title: 'Address', field: 'address'},
                        { title: 'Policy Code', field: 'code'},
                        { title: 'Start Date', field: 'start_date'},
                        { title: 'End Date', field: 'end_date'},
                        { title: 'Amount Paid', field: 'amount_paid', render: ph => <p>${ph.amount_paid}</p>},
                        { title: 'Amount Remaining', field: 'amount_remaining', render: ph => <p>${ph.amount_remaining}</p>},
                        {
                            title: 'Status',
                            field: 'policy_status',
                            render: p => <p>{this.translateStatus(p.policy_holder_status)}</p>
  
                        },
                        {
                            title: 'Transactions',
                            field: '',
                            render: ph => <Link to={{
                                pathname: '/policy-holder/view-transactions',
                                state: {
                                  policyHolder: ph
                                }
                              }}>View</Link>

                        },
                        {
                            title: '',
                            field: '',
                            render: ph => <Link to={{
                                pathname: '/policy-holder/edit',
                                state: {
                                  policyHolder: ph
                                }
                              }}>Edit</Link>

                        }
                    ]}
                    data={this.state.policyHolders}
                />
            </div>
        )
    }

}