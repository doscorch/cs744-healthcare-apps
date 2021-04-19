import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, Link, Router } from 'react-router-dom';
import Login from './auth/login';
import Register from './auth/register';
import ChangePassword from './auth/changePassword'
import './App.css';
import { logout } from './auth/usersService';
import { withRouter } from 'react-router-dom';
import { app_logout } from './redux/actions/userActions';
import { connect } from 'react-redux';
import UserManager from './users/userManager'
import MyAccount from './auth/myAccount';
import SecurityQuestion from './auth/securityQuestion';
import { UserType } from './models/user';
import changeSecurityQuestions from './auth/changeSecurityQuestions';
import PolicyManager from './policy/policyManager';
import CreatePolicy from './policy/create';
import EditPolicy from './policy/edit';
import PolicyHolderManager from './policyHolder/policyHolderManager';
import CreatePolicyHolder from './policyHolder/create';
import EditPolicyHolder from './policyHolder/edit';
import RequestManager from './request/requestManager';
import RequestManagerHC from './request/requestManagerHC';
import PhysicianManager from './physicians/physicianManager';
import ViewTransactions from './policyHolder/viewTransactions';

class App extends React.Component {

  clickLogout = async (e) => {
    e.preventDefault();
    await logout();
    this.props.app_logout();
    this.props.history.push('/');
  }
  render() {
    const hasUser = Boolean(this.props.user.is_validated);
    const isAdmin = this.props.user.user_type === UserType.Admin;
    const isAgent = this.props.user.user_type === UserType.Agent;

    return (
      <div>
        <Navbar sticky="top" bg="light" variant="light" expand="lg" style={{ marginBottom: "10px" }}>
          <Navbar.Brand as={Link} to="/"><img style={{ width: "30px", height: "30px" }} src="logo.png" alt="logo"></img> Insurance System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {hasUser && isAdmin ? <Nav.Link as={Link} to="/user-manager">Manage Users</Nav.Link> : ""}
              {hasUser && isAgent ? <Nav.Link as={Link} to="/manage-policies">Manage Policies</Nav.Link> : ""}
              {hasUser && isAgent ? <Nav.Link as={Link} to="/manage-policy-holders">Manage Policy Holders</Nav.Link> : ""}
              {hasUser && isAgent ? <Nav.Link as={Link} to="/manage-requests-pharmacy">Manage Pharmacy Requests</Nav.Link> : ""}
              {hasUser && isAgent ? <Nav.Link as={Link} to="/manage-requests-healthcare">Manage Healthcare Requests</Nav.Link> : ""}
              {hasUser && isAgent ? <Nav.Link as={Link} to="/manage-physicians">Manage Physicians</Nav.Link> : ""}

            </Nav>
            <Nav>
              {hasUser ? <Nav.Link as={Link} to="/" onClick={this.clickLogout}><i className="fas fa-sign-out-alt"></i> Logout</Nav.Link> : ""}
              {hasUser ? <Nav.Link as={Link} to="/account"><i className="fas fa-user"></i> {this.props.user.first_name} {this.props.user.last_name}</Nav.Link> : ""}
              {!hasUser ? <Nav.Link as={Link} to="/login"><i className="fas fa-sign-in-alt"></i> Login</Nav.Link> : ""}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Route exact path="/" component={Home} />
        <Route exact path="/home" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/security-question" component={SecurityQuestion} />
        <Route path="/register" component={Register} />
        <Route path="/changePassword" component={ChangePassword} />
        <Route path="/changeSecurityQuestions" component={changeSecurityQuestions} />
        <Route path="/account" component={MyAccount} />
        <Route path="/user-manager" component={UserManager} />
        <Route path="/manage-policies" component={PolicyManager} />
        <Route path="/policy/create" component={CreatePolicy}></Route>
        <Route path="/policy/edit" component={EditPolicy}></Route>
        <Route path="/manage-policy-holders" component={PolicyHolderManager} />
        <Route path="/policy-holder/create" component={CreatePolicyHolder} />
        <Route path="/policy-holder/edit" component={EditPolicyHolder} />
        <Route path="/manage-requests-pharmacy" component={RequestManager}/>
        <Route path="/manage-requests-healthcare" component={RequestManagerHC}/>
        <Route path="/policy-holder/view-transactions" component={ViewTransactions}/>
        <Route path="/manage-physicians" component={PhysicianManager}/>

        
      </div>
    );
  }
}

function Home() {
  return (
    <div className="container" style={{ backgroundColor: "darkgrey" }}>
      <div class="row">
        <div style={{ margin: "auto", marginBottom: "20px" }}>
          <img src="logo.png" alt="home image" style={{ width: "100px" }}></img>
          <span style={{ fontSize: "3em" }}></span>
        </div>
      </div>
      <div className="row">
        <div className="card card-body bg-light" style={{ height: "300px" }}>
          <span >
            Welcome to the Insurance application.
          </span>
        </div>
      </div>
    </div>
  )
}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_logout };
export default connect(mapState, mapDispatch)(withRouter(App));
