import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './card';
import Balance from './balance';
import { getAuthHeaderObj, handleTokenRefresh } from '../util';
import AppContext from './app-context';

export default function Withdraw() {
  let [withdrawAmount, setWithdrawAmount] = useState(0);
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();
  const { setAlertObj } = useContext(AppContext);

  useEffect(() => {
    setAlertObj(undefined);
  }, [setAlertObj]);

  async function handleWithdraw(
    isRegenTokenRefresh = true,
    setClientUser,
    setAlertObj
  ) {
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
      let data = await res.json();
      if (data.error && isRegenTokenRefresh) {
        data = await handleTokenRefresh(data, handleWithdraw);
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
    setWithdrawAmount('0.00');
    setShow(true);
  }
  return (
    <AppContext.Consumer>
      {({ setClientUser, setAlertObj }) => (
        <Card
          header="Withdraw"
          bgcolor="light"
          txtcolor="black"
          status={status}
          body={
            show ? (
              <>
                <form
                  onSubmit={(e) => {
                    handleWithdraw(true, setClientUser, setAlertObj);
                    e.preventDefault();
                  }}
                >
                  Balance
                  <h5>
                    <Balance />
                  </h5>
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
                    className="btn btn-primary"
                  >
                    Withdraw
                  </button>
                </form>
              </>
            ) : (
              <>
                <h5>Withdraw Successful</h5>
                <br />
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={clearForm}
                >
                  Make another withdrawal
                </button>
              </>
            )
          }
        />
      )}
    </AppContext.Consumer>
  );
}
