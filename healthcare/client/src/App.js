import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';
import Login from './auth/login';
import Register from './auth/register';
import './App.css';
import { logout } from './auth/usersService';
import { withRouter } from 'react-router-dom';
import { app_logout } from './redux/actions/userActions';
import { connect } from 'react-redux';
import UserManager from './users/userManager'
import MyAccount from './auth/myAccount';
import SecurityQuestion from './auth/securityQuestion';

class App extends React.Component {

  clickLogout = async (e) => {
    e.preventDefault();
    await logout();
    this.props.app_logout();
    this.props.history.push('/');
  }
  render() {
    const hasUser = Boolean(this.props.user.user_id);
    const isAdmin = this.props.user.user_type === "admin";
    return (
      <div>
        <Navbar sticky="top" bg="dark" variant="dark" expand="lg" style={{ marginBottom: "10px" }}>
          <Navbar.Brand as={Link} to="/"><img style={{ width: "30px", height: "30px" }} src="../logo.png" alt="logo"></img> Healthcare System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {/* {isAdmin ? <Nav.Link as={Link} to="/user-manager">Manage Users</Nav.Link> : ""} */}
            </Nav>
            <Nav>
              {hasUser ? <Nav.Link as={Link} to="/" onClick={this.clickLogout}><i className="fas fa-sign-out-alt"></i> Logout</Nav.Link> : ""}
              {hasUser ? <Nav.Link as={Link} to="/account"><i className="fas fa-user"></i> {this.props.user.username}</Nav.Link> : ""}
              {!hasUser ? <Nav.Link as={Link} to="/login"><i className="fas fa-sign-in-alt"></i> Login</Nav.Link> : ""}
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Route exact path="/" component={Home} />
        <Route exact path="/home" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/security-question" component={SecurityQuestion} />
        <Route path="/register" component={Register} />
        <Route path="/account" component={MyAccount} />
        <Route path="/user-manager" component={UserManager} />
      </div>
    );
  }
}

function Home() {
  return (
    <div className="container" style={{ backgroundColor: "darkgrey" }}>
      <div class="row">
        <div style={{ margin: "auto", marginBottom: "20px" }}>
          <img src="../logo.png" alt="home image" style={{ width: "100px" }}></img>
          <span style={{ fontSize: "3em" }}></span>
        </div>
      </div>
      <div className="row">
        <div className="card card-body bg-light" style={{ height: "300px" }}>
          <span >
            Welcome to the Healthcare application.
          </span>
        </div>
      </div>
    </div>
  )
}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_logout };
export default connect(mapState, mapDispatch)(withRouter(App));
