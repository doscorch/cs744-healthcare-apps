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
import WritePrescription from './physician/writePrescription';
import { UserType } from './models/user';
import changeSecurityQuestions from './auth/changeSecurityQuestions';
import SearchPatients from './physician/searchPatients';
import PatientPrescriptions from './physician/patientPrescriptions';
import ViewPrescription from './prescription/viewPrescription';
import ChangePhysician from './auth/changePhysician';
import WriteVisitation from './physician/writeVisitation';
import PatientVisitations from './visitation/patientVisitations';
import ViewVisitation from './visitation/viewVisitation';
import ViewAllPatients from './users/viewAllPatients';
import ViewBill from './visitation/viewBill';
import ViewAllPhysicians from './users/viewAllPhysicians';
import EditPhysicianInfo from './users/editPhysicianInfo';
import EditPatientInfo from './users/editPatientInfo';

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
    const isPhysician = this.props.user.user_type === UserType.Physician;
    const isPatient = this.props.user.user_type === UserType.Patient;
    const isStaffMember = this.props.user.user_type === UserType.StaffMember;
    return (
      <div>
        <Navbar sticky="top" bg="light" variant="light" expand="lg" style={{ marginBottom: "10px" }}>
          <Navbar.Brand as={Link} to="/"><img style={{ width: "30px", height: "30px" }} src="logo.png" alt="logo"></img> Healthcare System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {hasUser && isAdmin ? <Nav.Link as={Link} to="/user-manager">Manage Users</Nav.Link> : ""}
              {hasUser && isPhysician ? <Nav.Link as={Link} to={"/search-patients/"+this.props.user.user_id}>Patients</Nav.Link> : ""}
              {hasUser && isPatient ? <Nav.Link as={Link} to={"/patient/"+this.props.user.user_id+"/prescriptions"}>Prescriptions</Nav.Link> : ""}
              {hasUser && isPatient ? <Nav.Link as={Link} to={"/visitations/"+this.props.user.user_id}>Visitations</Nav.Link> : ""}
              {hasUser && isStaffMember ? <Nav.Link as={Link} to={"/patients"}>Patients</Nav.Link> : ""}
              {hasUser && isStaffMember ? <Nav.Link as={Link} to={"/physicians"}>Physicians</Nav.Link> : ""}
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
        <Route path="/search-patients/:physician" component={SearchPatients} />
        <Route path="/write-prescription/:patient" component={WritePrescription}/>
        <Route path="/patient/:patient/prescriptions" component={PatientPrescriptions}/>
        <Route path="/prescriptions/:prescription" component={ViewPrescription}/>
        <Route path="/change-physician" component={ChangePhysician}/>
        <Route path="/write-visitation/:patient" component={WriteVisitation}/>
        <Route path="/visitations/:patient" component={PatientVisitations}/>
        <Route exact path="/visit/:visit" component={ViewVisitation}/>
        <Route path="/patients" component={ViewAllPatients}/>
        <Route path="/physicians" component={ViewAllPhysicians}/>
        <Route exact path="/visit/:visit/bill" component={ViewBill}/>
        <Route exact path="/users/physician/:id" component={EditPhysicianInfo}/>
        <Route exact path="/users/patient/:id" component={EditPatientInfo}/>
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
