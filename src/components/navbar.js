import { NavLink } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import AppContext from './app-context';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../util';

export default function NavBar() {
  const navigate = useNavigate();

  function logout(setClientUser, setAlertObj) {
    const { name } = getUser();
    localStorage.removeItem('user');
    setClientUser(undefined);
    setAlertObj({
      message: `You've successfully logged out, ${name}. See you next time.`,
      bannerType: 'success',
    });
    navigate('/');
  }
  return (
    <AppContext.Consumer>
      {({ clientUser, setClientUser, setAlertObj }) => (
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
                {!clientUser && (
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? 'active nav-link' : 'nav-link'
                    }
                    to="/CreateAccount/"
                    title="Create your account here"
                  >
                    Create Account
                  </NavLink>
                )}
                {!clientUser && (
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? 'active nav-link' : 'nav-link'
                    }
                    to="/Login/"
                    title="Login to your account here"
                  >
                    Login
                  </NavLink>
                )}
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
                {clientUser && clientUser.email.includes('@bad-bank.com') && (
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? 'active nav-link' : 'nav-link'
                    }
                    to="/AllData/"
                    title="All users input"
                  >
                    All Data
                  </NavLink>
                )}
              </Nav>
              {clientUser && (
                <Nav className="ml-auto">
                  <Nav.Item className="navbar-client-name">
                    Hi, {clientUser.name}
                  </Nav.Item>
                  <Nav.Link onClick={() => logout(setClientUser, setAlertObj)}>
                    Logout
                  </Nav.Link>
                </Nav>
              )}
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </AppContext.Consumer>
  );
}
