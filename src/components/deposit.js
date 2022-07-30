import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './card';
import Balance from './balance';
import { getAuthHeaderObj, handleTokenRefresh } from '../util';
import AppContext from './app-context';

export default function Deposit() {
  let [depositAmount, setDepositAmount] = useState(0);
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const { setAlertObj } = useContext(AppContext);

  useEffect(() => {
    setAlertObj(undefined);
  }, [setAlertObj]);

  async function handleDeposit(
    isRegenTokenRefresh = true,
    setClientUser,
    setAlertObj
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
      const url = `${process.env.REACT_APP_WEB_SERVER_PROTOCOL}://localhost:${process.env.REACT_APP_WEB_SERVER_PORT}/account/update/${parsedDepositAmount}`;
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
          setAlertObj({
            message: 'Your session has expired. Please re-login.',
          });
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
      {({ setClientUser, setAlertObj }) => (
        <Card
          header="Deposit"
          bgcolor="light"
          txtcolor="black"
          status={status}
          body={
            show ? (
              <>
                <form
                  onSubmit={(e) => {
                    handleDeposit(true, setClientUser, setAlertObj);
                    e.preventDefault();
                  }}
                >
                  Balance
                  <h5>
                    <Balance />
                  </h5>
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
                    className="btn btn-primary"
                  >
                    Deposit
                  </button>
                </form>
              </>
            ) : (
              <>
                <h5>Deposit Successful</h5>
                <br />
                <button
                  type="submit"
                  className="btn btn-primary"
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
