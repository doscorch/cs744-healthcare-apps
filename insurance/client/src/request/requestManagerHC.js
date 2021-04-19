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
import {getAllPolicyHolders, updatePolicyHolder} from '../policyHolder/policyHolderService';


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
            onClick={() => {this.acceptRequest(r)}}>
            Accept
        </Button>;
        }
    }

    showDenyButton(r) {
        if (r.request_hc_status == 2) {
            return <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            onClick={() => {this.denyRequest(r)}}>
            Deny
        </Button>;
        }
    }

    async acceptRequest(request) {
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
        console.log(policy);
        console.log(policyHolder);

        request.request_hc_status = 1;
        request.policy = policy;
        await requestActionHC(request);
        this.componentDidMount();

        // handle transactions
        applyTransactionHC(request);

        

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

        let res = await updatePolicyHolder(
            policyHolder.policy_holder_id,
            policyHolder.first_name,
            policyHolder.last_name,
            policyHolder.date_of_birth,
            policyHolder.address,
            policyHolder.policy_id,
            policyHolder.start_date,
    
            policyHolder.end_date,
            paid,
            remaining,
            policyHolder.policy_holder_status);

            
    
        console.log('Result');
        console.log(res);
    }

    async denyRequest(request) {
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

        let policies = await getAllPolicies();
        policies = policies.data;
        let policy = null;

        for (let i = 0; i < policies.length; i++) {
            if (policies[i].policy_id == policyHolder.policy_id) {
                policy = policies[i];
                break;
            }
        }
        console.log(policy);
        console.log(policyHolder);
        request.policy = policy;
        request.request_hc_status = 0;
        await requestActionHC(request);
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
            result = await getProcedure(requests[i]['procedure_id']);
            requests[i]['procedure_id_hc'] = result.data[0].procedure_id_hc;
            requests[i]['procedure_name'] = result.data[0].procedure_name;
        }

        this.setState({ requests: requests });

    }

    translateStatus(status) {
        if (status === 2) {
          return 'Pending';
        } else if (status == 1) {
          return 'Accepted';
        } else {
            return 'Denied';
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