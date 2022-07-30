import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './card';
import { setUser, getUser } from '../util';
import AppContext from './app-context';

export default function CreateAccount() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function validate(field, label) {
    if (!field) {
      setStatus('Error: Please enter ' + label);
      setTimeout(() => setStatus(''), 3000);
      return false;
    }
    return true;
  }
  function passwordLength(password) {
    if (password.length >= 8) {
      return true;
    } else {
      return false;
    }
  }
  async function handleCreate(setClientUser, setAlertObj) {
    setStatus(''); // clear status before attempting to create
    if (!validate(name, 'name')) return;
    if (!validate(email, 'email')) return;
    if (!validate(password, 'password')) return;
    if (!passwordLength(password)) {
      setStatus('Error: Password must be at least 8 characters long');
      return;
    }
    try {
      const url = `/account/create/${name}/${email}/${password}`;
      const res = await fetch(url, { method: 'POST' });
      const data = await res.json();
      if (data.error) {
        setStatus(data.error);
        return;
      }
      setAlertObj(undefined);
      setUser(data);
      setClientUser(getUser());
      navigate('/');
      setShow(false);
    } catch (error) {
      console.error(error);
      setStatus('Error');
    }
  }

  function clearForm() {
    setName('');
    setEmail('');
    setPassword('');
    setShow(true);
  }
  return (
    <AppContext.Consumer>
      {({ setClientUser, setAlertObj }) => (
        <Card
          header="Create Account"
          status={status}
          bgcolor="light"
          txtcolor="black"
          body={
            show ? (
              <>
                <form
                  onSubmit={(e) => {
                    handleCreate(setClientUser, setAlertObj);
                    e.preventDefault();
                  }}
                >
                  Name
                  <br />
                  <input
                    type="input"
                    className="form-control"
                    id="name"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.currentTarget.value)}
                  />
                  <br />
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
                    disabled={!name || !email || !password}
                    type="submit"
                    className="btn btn-primary"
                  >
                    Create Account
                  </button>
                </form>
              </>
            ) : (
              <>
                <h5>Success</h5>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={clearForm}
                >
                  Add another account
                </button>
              </>
            )
          }
        />
      )}
    </AppContext.Consumer>
  );
}
