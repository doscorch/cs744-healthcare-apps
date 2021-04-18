import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Route, Link } from 'react-router-dom';
import Login from './auth/login';
import Register from './auth/register';
import ChangePassword from './auth/changePassword'
import './App.css';
import { logout } from './auth/usersService';
import { withRouter } from 'react-router-dom';
import { app_logout } from './redux/actions/userActions';
import { connect } from 'react-redux';
import UserManager from './users/userManager'
import PhysicianManager from './physicians/physicianManager'
import PatientManager from './patients/patientManager'
import MedicineManager from './medicines/medicineManager'
import PrescriptionManager from './prescriptions/prescriptionManager'
import MyAccount from './auth/myAccount';
import SecurityQuestion from './auth/securityQuestion';
import { UserType } from './models/user';
import changeSecurityQuestions from './auth/changeSecurityQuestions';
import ViewPrescription from './prescriptions/viewPrescription';
import VerifyPatient from './prescriptions/verifyPatient';
import VerifyPhysician from './prescriptions/verifyPhysician';
import FillPrescription from './prescriptions/fillPrescription';
import VerifyInsuranceRequest from './prescriptions/verifyInsuranceRequest';
import PrescriptionDetails from './prescriptions/prescriptionDetails';
import PrescriptionBill from './prescriptions/prescriptionBill';

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
    const isPharmacist = this.props.user.user_type === UserType.Pharmacist;

    return (
      <div>
        <Navbar sticky="top" bg="light" variant="light" expand="lg">
          <Navbar.Brand as={Link} to="/"><img style={{ width: "30px", height: "30px" }} src="logo.png" alt="logo"></img> Pharmacy System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {hasUser && isPharmacist ? <Nav.Link as={Link} to="/prescription-manager">Prescriptions</Nav.Link> : ""}
              {hasUser && isPharmacist ? <Nav.Link as={Link} to="/medicine-manager">Medicines</Nav.Link> : ""}
              {hasUser && isAdmin ? <Nav.Link as={Link} to="/user-manager">Manage Users</Nav.Link> : ""}
              {hasUser && isPharmacist ? <Nav.Link as={Link} to="/physician-manager">Physicians</Nav.Link> : ""}
              {hasUser && isPharmacist ? <Nav.Link as={Link} to="/patient-manager">Patients</Nav.Link> : ""}
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
        <Route path="/prescription-manager" component={PrescriptionManager} />
        <Route path="/physician-manager" component={PhysicianManager} />
        <Route path="/patient-manager" component={PatientManager} />
        <Route path="/medicine-manager" component={MedicineManager} />

        <Route path="/prescriptions/:prescription" component={ViewPrescription} />
        <Route path="/prescription-details/:prescription" component={PrescriptionDetails} />
        <Route path="/prescription-bill/:prescription" component={PrescriptionBill} />
        <Route path="/verify-patient/:prescription" component={VerifyPatient} />
        <Route path="/verify-physician/:prescription" component={VerifyPhysician} />
        <Route path="/fill-prescription/:prescription" component={FillPrescription} />
        <Route path="/verify-insurance-request/:prescription" component={VerifyInsuranceRequest} />

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
            Welcome to the Pharmacy application.
          </span>
        </div>
      </div>
    </div>
  )
}

const mapState = (state) => { return { user: state.user } };
const mapDispatch = { app_logout };
export default connect(mapState, mapDispatch)(withRouter(App));
