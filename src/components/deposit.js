import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './card';
import { getAuthHeaderObj, handleTokenRefresh } from '../util';
import AppContext from './app-context';

export default function Deposit() {
  let [depositAmount, setDepositAmount] = useState(0);
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  async function handleDeposit(
    isRegenTokenRefresh = true,
    setClientUser,
    setAlertMessage
  ) {
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
    }
    try {
      // make request to back end
      const url = `http://localhost:3001/account/update/${parsedDepositAmount}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaderObj(),
      });
      let data = await res.json();
      if (data.error && isRegenTokenRefresh) {
        data = await handleTokenRefresh(data, handleDeposit);
        if (data && data.error && data.code === 1) {
          // Reauth
          console.log(data.error);
          setClientUser(undefined);
          setAlertMessage('Your session has expired. Please re-login.');
          navigate('/Login');
        } else if (data && data.error) {
          setStatus(data.error);
        }
        return;
      } else if (data.error) {
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
    setDepositAmount('0.00');
    setShow(true);
  }
  return (
    <AppContext.Consumer>
      {({ setClientUser, setAlertMessage }) => (
        <Card
          header="Deposit"
          bgcolor="warning"
          status={status}
          body={
            show ? (
              <>
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
                  onClick={() =>
                    handleDeposit(true, setClientUser, setAlertMessage)
                  }
                >
                  Deposit
                </button>
              </>
            ) : (
              <>
                <h5>Deposit Successful</h5>
                <br />
                <button
                  type="submit"
                  className="btn btn-light"
                  onClick={clearForm}
                >
                  Make another deposit
                </button>
              </>
            )
          }
        />
      )}
    </AppContext.Consumer>
  );
}
