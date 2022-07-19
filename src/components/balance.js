import React from 'react';
import Card from './card';
import { getAuthHeaderObj } from '../util';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function Balance() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState('');
  const [balance, setBalance] = React.useState(0);

  async function handleCheckBalance() {
    setStatus(''); // clear status before attempting to check balance
    try {
      const url = `http://localhost:3001/account/user`;
      const res = await fetch(url, {
        headers: getAuthHeaderObj(),
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        setStatus(data.error);
        return;
      }
      setBalance(data.balance);
      setShow(false);
    } catch (error) {
      console.error(error);
      setStatus('Error')
    }
  }

  function clearForm() {
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
            <button
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
