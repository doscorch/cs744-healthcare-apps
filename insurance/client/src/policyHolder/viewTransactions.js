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
        transactions: []
    }

    async componentDidMount() {
        let result = await getTransactions(this.props.location.state.policyHolder.policy_holder_id);
        console.log(result);
        let transactions = result.data;
        for (let i = 0; i < transactions.length; i++) {
            transactions[i]['transaction_date'] = transactions[i]['transaction_date'].split('T')[0];
        }
        this.setState({ transactions: transactions });

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
                    title="Transactions"
                    columns={[
                        { title: 'Date', field: 'transaction_date' },
                        { title: 'Drug', field: 'drug_name' },
                        { title: 'Amount', field: 'amount', render: t => {return '$' + t.amount} },
                        
                    ]}
                    data={this.state.transactions}
                />
            </div>
        )
    }

}