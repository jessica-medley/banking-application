import { NavLink } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import AppContext from './app-context';
import { useNavigate } from 'react-router-dom';

export default function NavBar() {
  const navigate = useNavigate();
  
  function logout(setClientUser) {
    localStorage.removeItem('user');
    setClientUser(undefined);
    navigate('/');
  }
  return (
    <AppContext.Consumer>
      {({ clientUser, setClientUser }) => (
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand>
              <NavLink className="navbar-brand" to="/" title="Home">
                Incredibly Bad Bank
              </NavLink>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'active nav-link' : 'nav-link'
                  }
                  to="/CreateAccount/"
                  title="Create your account here"
                >
                  Create Account
                </NavLink>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'active nav-link' : 'nav-link'
                  }
                  to="/Login/"
                  title="Login to your account here"
                >
                  Login
                </NavLink>
                {clientUser && (
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? 'active nav-link' : 'nav-link'
                    }
                    to="/Deposit/"
                    title="Make a deposit here"
                  >
                    Deposit
                  </NavLink>
                )}
                {clientUser && (
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? 'active nav-link' : 'nav-link'
                    }
                    to="/Withdraw/"
                    title="Make a withdraw here"
                  >
                    Withdraw
                  </NavLink>
                )}
                {clientUser && (
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? 'active nav-link' : 'nav-link'
                    }
                    to="/Balance/"
                    title="All users input"
                  >
                    Balance
                  </NavLink>
                )}
                {/* {clientUser && (
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? 'active nav-link' : 'nav-link'
                    }
                    to="/AllData/"
                    title="All users input"
                  >
                    All Data
                  </NavLink>
                )} */}
              </Nav>
              {clientUser && (
                <Nav className="ml-auto">
                  <Nav.Item className="navbar-client-name">Hi, {clientUser.name}!</Nav.Item>
                  <Nav.Link onClick={() => logout(setClientUser)}>Logout</Nav.Link>
                </Nav>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </AppContext.Consumer>
  );
}
