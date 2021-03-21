import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';
import { UserType, UserStatus } from '../models/user';

class MyAccount extends React.Component {
    state = {
        enrollments: [],
        programs: [],
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
                                    <h4>Patient Information</h4>
                                    : "" }
                                    {user.user_type === UserType.Physician ? 
                                    <h4>Physician Information</h4>
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