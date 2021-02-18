import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { connect } from 'react-redux';

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