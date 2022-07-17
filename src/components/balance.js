import React from 'react';
import Card from './card';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function Balance() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState('');
  const [balance, setBalance] = React.useState(0);
  const [email, setEmail] = React.useState('');

  function validate(field, label) {
    if (!field) {
      setStatus(alert('Error: Please enter ' + label));
      setTimeout(() => setStatus(''), 3000);
      return false;
    }
    return true;
  }

  async function handleCheckBalance() {
    setStatus(''); // clear status before attempting to check balance
    if (!validate(email, 'email')) return;

    const url = `/account/user/${email}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    if (data.error) {
      setStatus(data.error);
      return;
    }
    setBalance(data.balance);
    setShow(false);
  }

  function clearForm() {
    setEmail('');
    setShow(true);
  }
  return (
    <Card
      bgcolor="info"
      header="Balance"
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
            <button
              disabled={!email}
              type="submit"
              className="btn btn-light"
              onClick={() => handleCheckBalance()}
            >
              Check balance
            </button>
          </>
        ) : (
          <>
            <h5>Balance: {formatter.format(balance)}</h5>
            <button type="submit" className="btn btn-light" onClick={clearForm}>
              Check balance again
            </button>
          </>
        )
      }
    />
  );
}
