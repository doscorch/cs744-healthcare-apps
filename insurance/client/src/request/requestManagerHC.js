import * as React from 'react';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import { Select, MenuItem } from '@material-ui/core'
import { UserType, UserStatus } from '../models/user';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {getAllRequestsHC, getProcedure, requestActionHC, applyTransactionHC} from './requestService';
import {getAllPolicies} from '../policy/policyService';
import {getAllPolicyHolders} from '../policyHolder/policyHolderService';


export default class RequestManagerHC extends React.Component {
    state = {
        requests: []
    }

    showAcceptButton(r) {
        if (r.request_hc_status == 2) {
            return <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {this.request(r, true)}}>
            Accept
        </Button>;
        }
    }

    showDenyButton(r) {
        if (r.request_hc_status == 2 || r.request_hc_status == 3 || r.request_hc_status == 4) {
            return <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => {this.request(r, false)}}>
            Deny
        </Button>;
        }
    }

    async request(request, accept) {
        let ph = await getAllPolicyHolders();
        ph = ph.data;
        console.log(ph);
        console.log(request);
        let policyHolder = null;
        for (let i = 0; i < ph.length; i++) {
            ph[i]['date_of_birth'] = ph[i]['date_of_birth'].split('T')[0];
            ph[i]['start_date'] = ph[i]['start_date'].split('T')[0];
            ph[i]['end_date'] = ph[i]['end_date'].split('T')[0];
            if (ph[i].first_name == request.first_name && ph[i].last_name == request.last_name
                && ph[i].address == request.address && ph[i].date_of_birth == request.date_of_birth) {
                
                    policyHolder = ph[i];
                    break;
            }
        }

        console.log(policyHolder)

        let policies = await getAllPolicies();
        console.log(policies);
        policies = policies.data;
        let policy = null;

        for (let i = 0; i < policies.length; i++) {
            if (policies[i].policy_id == policyHolder.policy_id) {
                policy = policies[i];
                break;
            }
        }

        let remaining = Number(policyHolder.amount_remaining);
        let paid = Number(policyHolder.amount_paid);
        console.log(paid);
        let amount = request.amount;
        let per = policy.percent_coverage / 100;

        let covered = amount * per;


        if (remaining < covered) {
            covered = remaining;
        }

        paid += covered;
        remaining -= covered;
        
        request.paid = paid;
        request.remaining = remaining;
        request.covered = covered;
        request.policy_holder = policyHolder;
        request.old_request_hc_status = request.request_hc_status;

        if (accept) {
            request.request_hc_status = 1;
        } else {
            if (request.old_request_hc_status == 2) {
                request.request_hc_status = 0;
            } else if (request.old_request_hc_status == 3) {
                request.request_hc_status = 5;
            } else if (request.old_request_hc_status == 4) {
                request.request_hc_status = 6;
            }
        }
        request.policy = policy;

        console.log('request!');
        console.log(request);
        let res = await requestActionHC(request);
        console.log('res');
        console.log(res);
        this.componentDidMount();
    }

    async componentDidMount() {
        console.log('getting requests');

        let result = await getAllRequestsHC();
        console.log(result);

        let requests = result.data;

        // format date
        for (let i = 0; i < requests.length; i++) {
            requests[i]['date_of_birth'] = requests[i]['date_of_birth'].split('T')[0];
            requests[i]['request_hc_date'] = requests[i]['request_hc_date'].split('T')[0];
            let payload = JSON.parse(requests[i]['payload']);
            //payload
            requests[i]['procedure_id_hc'] = payload.procedure.procedure_id;
            requests[i]['procedure_name'] = payload.procedure.name;
            
        }

        this.setState({ requests: requests });

    }

    translateStatus(status) {
        if (status == 2 || status == 3 || status == 4) {
          return 'Pending';
        } else if (status == 1) {
          return 'Accepted';
        } else if (status == 0) {
            return 'Denied';
        } else if (status == 6) {
            return 'Denied (No coverage)';
        } else if (status == 5) {
            return 'Denied (Not a policy holder)';
        }
    }

    render() {
        const tableRef = React.createRef();
        return (
            <div>
                <MaterialTable
                    tableRef={tableRef}
                    options={{
                        sorting: true,
                        search: true,
                        paging: false,
                    }}
                    title="Requests"
                    columns={[
                        { title: 'Status', field: 'request_hc_status', render: r => this.translateStatus(r.request_hc_status) },
                        { title: 'Request Date', field: 'request_hc_date'},
                        { title: 'First Name', field: 'first_name'},
                        { title: 'Last Name', field: 'last_name'},
                        { title: 'Address', field: 'address'},
                        { title: 'Date of Birth', field: 'date_of_birth'},
                        { title: 'Amount', field: 'amount', render: r => <p>${r.amount}</p>},
                        { title: 'Name', field: 'procedure_name'},
                        {
                            title: '',
                            field: '',
                            render: r => this.showAcceptButton(r)

                        },
                        {
                            title: '',
                            field: '',
                            render: r => this.showDenyButton(r)

                        },

                    ]}
                    data={this.state.requests}
                />
            </div>
        )
    }

}