import { useState } from 'react';
import Card from './card';

export default function Withdraw() {
  let [withdrawAmount, setWithdrawAmount] = useState(0);
  const [show, setShow] = useState(true);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  async function handleWithdraw() {
    setStatus(''); // clear status before attempting to withdraw
    if (!withdrawAmount) {
      withdrawAmount = 0;
    }
    const parsedWithdrawAmount = parseFloat(withdrawAmount);
    if (typeof parsedWithdrawAmount !== 'number') {
      return setStatus('Withdraw amount must be a number!');
    } else if (parsedWithdrawAmount < 0) {
      return setStatus("Can't withdraw a negative amount!");
    } else if (parsedWithdrawAmount === 0) {
      return setStatus('Please enter an amount to withdraw!');
    } else if (!email) {
      return setStatus('Error: Please enter ' + email);
    }
    // make request to back end
    const url = `/account/update/${email}/${-parsedWithdrawAmount}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) {
      setStatus(data.error);
      return;
    }
    setShow(false);
  }
  function clearForm() {
    setEmail('');
    setWithdrawAmount('0.00');
    setShow(true);
  }
  return (
    <Card
      header="Withdraw"
      bgcolor="success"
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
            Withdraw Amount
            <br />
            <input
              type="number"
              className="form-control"
              id="withdraw"
              placeholder="0.00"
              onChange={(e) => setWithdrawAmount(e.currentTarget.value)}
            />
            <br />
            <button
              disabled={withdrawAmount ? false : true}
              type="submit"
              className="btn btn-light"
              onClick={() => handleWithdraw()}
            >
              Withdraw
            </button>
          </>
        ) : (
          <>
            <h5>Withdraw Successful</h5>
            <br />
            <button type="submit" className="btn btn-light" onClick={clearForm}>
              Make another withdrawal
            </button>
          </>
        )
      }
    />
  );
}
