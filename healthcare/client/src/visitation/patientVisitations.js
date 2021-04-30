import * as React from 'react';
import MaterialTable from 'material-table';
import { Select, MenuItem } from '@material-ui/core'
import { getUsers, patchUser } from '../auth/usersService';
import { getPatientVisitations } from './visitationService';
import { UserType, UserStatus } from '../models/user';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { app_login } from '../redux/actions/userActions';

export class PatientVisitations extends React.Component {
    state = {
        visitations: []
    }

    componentDidMount() {
        this.getData();
    }

    translateStatus(status){
        if(status == 2){
            return "Waiting for insurance";
        }else if (status == 3){
            return "Pending"
        }else{
            return "Ready"
        }
    }

    getData = () => {
        return getPatientVisitations(this.props.match.params.patient)
            .then(visitations => {
                this.setState({ visitations: visitations })
            });
    }

    render() {
        const tableRef = React.createRef();
        const phyActions = [
            {
                icon: 'file_copy',
                tooltip: 'View Visitaiton',
                onClick: (event, row) => {
                    const visit_id = row.visitation_id;
                    this.props.history.push("/visit/"+visit_id);
                }
            }

        ];
        const otherActions = [
            {
                icon: 'file_copy',
                tooltip: 'View Visitaiton',
                onClick: (event, row) => {
                    const visit_id = row.visitation_id;
                    this.props.history.push("/visit/"+visit_id);
                }
            },
            {
                icon: 'local_atm',
                tooltip: 'View Bill',
                onClick: (event, row) => {
                    const visit_id = row.visitation_id;
                    this.props.history.push("/visit/"+visit_id+"/bill");
                }
            },

        ];
        return (
            <div>
                {this.props.user.user_type === UserType.Physician ? 
                    <Nav.Link as={Link} to={"/write-visitation/"+this.props.match.params.patient}><i className="fas fa-plus"></i> Write Visitation Record</Nav.Link>
                : ""}
                <MaterialTable
                    tableRef={tableRef}
                    options={{
                        sorting: true,
                        search: true,
                        paging: false,
                    }}
                    title="Patient Visitations"
                    actions={this.props.user.user_type === UserType.Physician? phyActions : otherActions}
                    columns={[
                        // { title: 'Id', field: '_id' },
                        { title: 'Patient Name', render: (entry) => { return entry.patient_first + " " + entry.patient_last}, validate: v => v.patient_first == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Physician Name', render: (entry) => { return entry.physician_first + " " + entry.physician_last}, validate: v => v.patient_last == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Status', field: 'status', render: (entry) => {return this.translateStatus(entry.status)}, validate: v => v.status == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                        { title: 'Visitation Date', render: (entry) => { 
                            let d = new Date(entry.visitation_date);
                            return d.getMonth()+1+"-"+d.getUTCDate()+"-"+d.getFullYear();
                            }, validate: v => v.creation_date == "" ? { isValid: false, helperText: "required" } : { isValid: true } },
                    ]}
                    data={this.state.visitations}
                />
            </div>

        )
    }

}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_login };

export default connect(mapState, mapDispatch)(PatientVisitations);