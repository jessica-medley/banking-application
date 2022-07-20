import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import Card from './card';
import { setUser, getUser } from '../util';
import AppContext from './app-context';

export default function Login() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const navigate = useNavigate();

  function validate(field, label) {
    if (!field) {
      setStatus(alert('Error: Please enter ' + label));
      setTimeout(() => setStatus(''), 3000);
      return false;
    }
    return true;
  }

  async function handleLogin({ setClientUser, setAlertMessage }) {
    setStatus(''); // clear status before attempting to login
    if (!validate(email, 'email')) return;
    if (!validate(password, 'password')) return;

    try {
      const url = `http://localhost:3001/account/login/${email}/${password}`;
      const res = await fetch(url, { method: 'POST' });
      const data = await res.json();
      if (data.error) {
        setStatus(data.error);
        return;
      }
      setAlertMessage('')
      setUser(data);
      setClientUser(getUser());
      setShow(false);
    } catch (error) {
      console.error(error);
      setStatus('Error');
    }
  }

  function clearForm() {
    setEmail('');
    setPassword('');
    setShow(true);
  }
  return (
    <AppContext.Consumer>
      {({ setClientUser, setAlertMessage }) => (
        <Card
          bgcolor="secondary"
          header="Login"
          status={status}
          body={
            show ? (
              <>
                Email
                <br />
                <input
                  type="input"
                  className="form-control"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
                <br />
                Password
                <br />
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <br />
                <button
                  disabled={!email || !password}
                  type="submit"
                  className="btn btn-light"
                  onClick={() => handleLogin({ setClientUser, setAlertMessage })}
                >
                  Login
                </button>
              </>
            ) : (
              <>
                <h5>Success</h5>
                <button
                  type="submit"
                  className="btn btn-light"
                  onClick={clearForm}
                >
                  Authenticate again
                </button>
              </>
            )
          }
        />
      )}
    </AppContext.Consumer>
  );
}
