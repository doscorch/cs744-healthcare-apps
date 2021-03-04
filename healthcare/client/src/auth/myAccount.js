import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';

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
                                    <p>{user.firstName}</p>
                                    <h6>Last Name</h6>
                                    <p>{user.lastName}</p>
                                    <h6>Username</h6>
                                    <p>{user.username}</p>
                                    <h6>Account Type</h6>
                                    <p>{user.userRole}</p>
                                    <p><a href="/changeQuestions">Change my security questions and answers</a></p>
                                    <Link to={{
                                        pathname: "/changePassword",
                                        state: { username: user.username }
                                        }}>Change password</Link>
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