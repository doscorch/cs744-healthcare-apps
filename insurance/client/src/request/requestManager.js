import * as React from 'react';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import { Select, MenuItem } from '@material-ui/core'
import { UserType, UserStatus } from '../models/user';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {getAllRequests, getDrug, requestAction, applyTransaction} from './requestService';
import {getAllPolicies} from '../policy/policyService';
import {getAllPolicyHolders, updatePolicyHolder} from '../policyHolder/policyHolderService';


export default class RequestManager extends React.Component {
    state = {
        requests: []
    }

    showAcceptButton(r) {
        if (r.request_status == 2) {
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
        if (r.request_status == 2 || r.request_status == 3 || r.request_status == 4) {
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

        request.covered = 0;
        request.policy = null;
        if (policyHolder != null) {
            let policies = await getAllPolicies();
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
            request.policy = policy;

        }

        request.policy_holder = policyHolder;
        request.old_request_status = request.request_status;

        if (accept) {
            request.request_status = 1;
        } else {
            if (request.old_request_status == 2) {
                request.request_status = 0;
            } else if (request.old_request_status == 3) {
                request.request_status = 5;
            } else if (request.old_request_status == 4) {
                request.request_status = 6;
            }
        }

        console.log('request!');
        console.log(request);
        let res = await requestAction(request);
        console.log('res');
        console.log(res);
        this.componentDidMount();
    }

    async componentDidMount() {
        console.log('getting requests');

        let result = await getAllRequests();
        console.log(result);

        let requests = result.data;

        // format date
        for (let i = 0; i < requests.length; i++) {
            requests[i]['date_of_birth'] = requests[i]['date_of_birth'].split('T')[0];
            requests[i]['request_date'] = requests[i]['request_date'].split('T')[0];
            let payload = JSON.parse(requests[i]['payload']);
            requests[i]['drug_name'] = payload.medicine.medical_name;
            requests[i]['drug_code'] = payload.medicine.medicine_code;
            requests[i]['commercial_name'] = payload.medicine.commercial_name;
        }
        requests.sort(function(a, b) {
            let bVal = b.request_status;
            let aVal = a.request_status;
            if (bVal == 5 || bVal == 6) {
                bVal = 0;
            }
            if (aVal == 5 || aVal == 6) {
                aVal = 0;
            }
            return bVal - aVal;
        });
        this.setState({ requests: requests });

    }

    translateStatus(status) {
        if (status == 3) {
            return 'Pending 3';
        } else if (status == 4) {
            return 'Pending 4'
        } else if (status == 2) {
          return 'Pending 2';
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
                        { title: 'Status', field: 'request_id', render: r => this.translateStatus(r.request_status), customSort: 
                        (a, b) => {
                            return b.request_status - a.request_status;
                        }
                        },
                        { title: 'Request Date', field: 'request_date'},
                        { title: 'First Name', field: 'first_name'},
                        { title: 'Last Name', field: 'last_name'},
                        { title: 'Address', field: 'address'},
                        { title: 'Date of Birth', field: 'date_of_birth'},
                        { title: 'Amount', field: 'amount', render: r => <p>${r.amount}</p>},
                        { title: 'Medical Name', field: 'drug_name'},
                        { title: 'Commercial Name', field: 'commercial_name'},
                        { title: 'Code', field: 'drug_code'},
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