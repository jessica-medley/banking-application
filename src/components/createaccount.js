import React from 'react';
import Card from './card';

export default function CreateAccount() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function validate(field, label) {
    if (!field) {
      setStatus(alert('Error: Please enter ' + label));
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
  function handleCreate() {
    console.log(name, email, password);
    if (!validate(name, 'name')) return;
    if (!validate(email, 'email')) return;
    if (!validate(password, 'password')) return;
    if (!passwordLength(password)) {
      alert('Password must be at least 8 characters long');
      return;
    }
    const url = `/account/create/${name}/${email}/${password}`;
    (async () => {
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
    })();
    setShow(false);
  }

  function clearForm() {
    setName('');
    setEmail('');
    setPassword('');
    setShow(true);
  }
  return (
    <Card
      txtcolor="black"
      header="Create Account"
      status={status}
      body={
        show ? (
          <>
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
              className="btn btn-light"
              onClick={() => handleCreate()}
            >
              Create Account
            </button>
          </>
        ) : (
          <>
            <h5>Success</h5>
            <button type="submit" className="btn btn-light" onClick={clearForm}>
              Add another account
            </button>
          </>
        )
      }
    />
  );
}
