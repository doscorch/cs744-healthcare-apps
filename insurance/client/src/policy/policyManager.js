import * as React from 'react';
import MaterialTable from 'material-table';
import { Select, MenuItem } from '@material-ui/core'
import { getUsers, patchUser } from '../auth/usersService';
import { UserType, UserStatus } from '../models/user';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';
import {getAllPolicies, getDrugsFromPolicyId} from '../policy/policyService';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default class PolicyManager extends React.Component {
    state = {
        policies: []
    }

    async componentDidMount() {
        let result = await getAllPolicies();
        let policies = result.data;

        for (let i = 0; i < policies.length; i++) {
            let policy_id = policies[i]['policy_id'];
            result = await getDrugsFromPolicyId(policy_id);
            let drugs = [];
            for (let j = 0; j < result.data.length; j++) {
                let drug = result.data[j]['drug_name'];
                drugs.push(drug);
            }
            policies[i]['drugs'] = drugs.join(', ');
        }

        this.setState({ policies: policies });
        console.log(this.state);

        //this.forceUpdate();
    }

    render() {
        // return <h1>Hello</h1>;
        const tableRef = React.createRef();
        return (
            <div>
                {<Nav.Link as={Link} to="/policy/create"><i className="fas fa-plus"></i> Create Policy</Nav.Link>}
                <MaterialTable
                    tableRef={tableRef}
                    options={{
                        sorting: true,
                        search: true,
                        paging: false,
                    }}
                    title="Policies"
                    columns={[
                        { title: 'Code', field: 'code'},
                        { title: 'Name', field: 'policy_name' },
                        { title: 'Age Limit', field: 'age_limit'},
                        { title: 'Max Coverage per Year', field: 'max_coverage_per_year'},
                        { title: 'Percentage of Coverage', field: 'percent_coverage'},
                        { title: 'Premium per Month', field: 'premium_per_month'},
                        { 
                            title: 'Drugs Covered',
                            field: 'policy_id',
                            render: p => <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                            >
                              <Typography>Expand</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Typography>
                                {p.drugs}
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        },
                        {
                            title: '',
                            field: 'policy_id',
                            render: p => <Link to={{
                                pathname: '/policy/edit',
                                state: {
                                  policy: p
                                }
                              }}>Edit</Link>

                        }
                    ]}
                    data={this.state.policies}
                />
            </div>
        )
    }

}