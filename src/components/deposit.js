import { useState } from 'react';
import Card from './card';

export default function Deposit() {
  let [depositAmount, setDepositAmount] = useState(0);
  const [show, setShow] = useState(true);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  async function handleDeposit() {
    setStatus(''); // clear status before attempting to deposit
    if (!depositAmount) {
      depositAmount = 0;
    }
    const parsedDepositAmount = parseFloat(depositAmount);
    if (typeof parsedDepositAmount !== 'number') {
      return setStatus('Deposit amount must be a number!');
    } else if (parsedDepositAmount < 0) {
      return setStatus("Can't deposit a negative amount!");
    } else if (parsedDepositAmount === 0) {
      return setStatus('Please enter an amount to deposit!');
    } else if (!email) {
      return setStatus('Error: Please enter ' + email);
    }
    // make request to back end
    const url = `/account/update/${email}/${parsedDepositAmount}`;
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
    setDepositAmount('0.00');
    setShow(true);
  }
  return (
    <Card
      header="Deposit"
      bgcolor="warning"
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
            Deposit Amount
            <br />
            <input
              type="number"
              className="form-control"
              id="withdraw"
              placeholder="0.00"
              onChange={(e) => setDepositAmount(e.currentTarget.value)}
            />
            <br />
            <button
              disabled={depositAmount ? false : true}
              type="submit"
              className="btn btn-light"
              onClick={() => handleDeposit()}
            >
              Deposit
            </button>
          </>
        ) : (
          <>
            <h5>Deposit Successful</h5>
            <br />
            <button type="submit" className="btn btn-light" onClick={clearForm}>
              Make another deposit
            </button>
          </>
        )
      }
    />
  );
}
