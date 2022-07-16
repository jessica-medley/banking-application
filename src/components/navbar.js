import { NavLink } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
export default function NavBar() {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>
            <NavLink className="navbar-brand" to="/" title="Home">
              Incredibly Bad Bank
            </NavLink>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "active nav-link" : "nav-link"
                }
                to="/CreateAccount/"
                title="Create your account here"
              >
                Create Account
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "active nav-link" : "nav-link"
                }
                to="/Login/"
                title="Login to your account here"
              >
                Login
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "active nav-link" : "nav-link"
                }
                to="/deposit/"
                title="Make a deposit here"
              >
                Deposit
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "active nav-link" : "nav-link"
                }
                to="/withdraw/"
                title="Make a withdraw here"
              >
                Withdraw
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "active nav-link" : "nav-link"
                }
                to="/alldata/"
                title="All users input"
              >
                All Data
              </NavLink>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
