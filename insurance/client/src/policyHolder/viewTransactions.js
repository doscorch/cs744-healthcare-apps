import * as React from 'react';
import MaterialTable from 'material-table';
import { Select, MenuItem } from '@material-ui/core'
import { UserType, UserStatus } from '../models/user';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {getTransactions} from './policyHolderService';

export default class ViewTransactions extends React.Component {
    state = {
        transactions: [],
        transactions_hc: [],
    }

    async componentDidMount() {
        let result = await getTransactions(this.props.location.state.policyHolder.policy_holder_id);
        console.log(result);
        let transactions = result.data.transactions;
        for (let i = 0; i < transactions.length; i++) {
            transactions[i]['transaction_date'] = transactions[i]['transaction_date'].split('T')[0];
        }
        this.setState({ transactions: transactions });

        let transactions_hc = result.data.transactions_hc;
        for (let i = 0; i < transactions_hc.length; i++) {
            transactions_hc[i]['transaction_hc_date'] = transactions_hc[i]['transaction_hc_date'].split('T')[0];
        }
        this.setState({ transactions_hc: transactions_hc });
        console.log(transactions_hc);
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
                    title="Pharmacy Transactions"
                    columns={[
                        { title: 'Date', field: 'transaction_date' },
                        { title: 'Code', field: 'drug_code' },
                        { title: 'Name', field: 'drug_name' },
                        { title: 'Commercial Name', field: 'commercial_name' },
                        { title: 'Amount', field: 'amount', render: t => {return '$' + (t.amount * (t.percent_coverage/100))} },
                        
                    ]}
                    data={this.state.transactions}
                />
                <MaterialTable
                    tableRef={tableRef}
                    options={{
                        sorting: true,
                        search: true,
                        paging: false,
                    }}
                    title="Healthcare Transactions"
                    columns={[
                        { title: 'Date', field: 'transaction_hc_date' },
                        { title: 'Drug', field: 'procedure_name' },
                        { title: 'Amount', field: 'amount', render: t => {return '$' + (t.amount * (t.percent_coverage/100))} },
                        
                    ]}
                    data={this.state.transactions_hc}
                />
            </div>
            
            
        )
    }

}