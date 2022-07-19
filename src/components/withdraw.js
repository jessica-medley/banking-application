import { useState } from 'react';
import Card from './card';
import { getAuthHeaderObj } from '../util';

export default function Withdraw() {
  let [withdrawAmount, setWithdrawAmount] = useState(0);
  const [show, setShow] = useState(true);
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
    }
    try {
      const url = `http://localhost:3001/account/update/${-parsedWithdrawAmount}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaderObj(),
      });
      const data = await res.json();
      if (data.error) {
        setStatus(data.error);
        return;
      }
      setShow(false);
    } catch (error) {
      console.error(error);
      setStatus('Error');
    }
  }
  function clearForm() {
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
