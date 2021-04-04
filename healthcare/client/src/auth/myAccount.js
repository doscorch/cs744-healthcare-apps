import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';
import { UserType, UserStatus } from '../models/user';

import {getPhysicianInfo, getPatientInfo} from './usersService';

class MyAccount extends React.Component {
    state = {
        enrollments: [],
        programs: [],
        physician: "",
        patient: ""
    }

    async componentDidMount() {
        let state = { ...this.state };
        if(this.props.user.user_type === UserType.Physician){
            let physician_info = await getPhysicianInfo(this.props.user.user_id);
            state['physician'] = physician_info;
        }
        if(this.props.user.user_type === UserType.Patient){
            let patient_info = await getPatientInfo(this.props.user.user_id);
            state['patient'] = patient_info;
        }
        this.setState(state);
    }

    render() {
        const user = this.props.user;
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <Card bg="light" style={{ padding: "10px" }}>
                            <Row>
                                <Col>
                                    <h4>Account Information</h4>
                                    <hr></hr>
                                    <h6>First Name</h6>
                                    <p>{user.first_name}</p>
                                    <h6>Last Name</h6>
                                    <p>{user.last_name}</p>
                                    <h6>Username</h6>
                                    <p>{user.username}</p>
                                    <h6>Account Type</h6>
                                    <p>{UserType.GetTranslation(user.user_type)}</p>
                                    <p>
                                        <Link to={{
                                            pathname: "/changeSecurityQuestions",
                                            state: { username: user.username }
                                        }}>Change security questions</Link>
                                    </p>
                                    <p>
                                        <Link to={{
                                            pathname: "/changePassword",
                                            state: { username: user.username }
                                        }}>Change password</Link>
                                    </p>
                                    {user.user_type === UserType.Patient ? 
                                    <div>
                                        <h4>Patient Information</h4>
                                        <h6>Date of Birth</h6>
                                        <p>{this.state.patient.date_of_birth}</p>
                                        <h6>Address</h6>
                                        <p>{this.state.patient.address}</p>
                                        <h6>Physician</h6>
                                        <p>{this.state.patient.physician_first} {this.state.patient.physician_last}</p>
                                        <p>
                                            <Link to={{
                                                pathname: "/change-physician",
                                                state: { username: user.username }
                                            }}>Change physician</Link></p>
                                    </div>
                                    : "" }
                                    
                                    {user.user_type === UserType.Physician ? 
                                    <div>
                                        <h4>Physician Information</h4>
                                        <h6>License</h6>
                                        <p>{this.state.physician.physician_state}-{this.state.physician.license_number}</p>
                                    </div>
                                    : "" }
                                    
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}


const mapState = (state) => { return { user: state.user } };
const mapDispatch = {};

export default connect(mapState, mapDispatch)(MyAccount);