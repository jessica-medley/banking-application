import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './card';
import { getAuthHeaderObj, handleTokenRefresh } from '../util';
import AppContext from './app-context';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function Balance() {
  const [show, setShow] = useState(true);
  const [status, setStatus] = useState('');
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  async function handleCheckBalance(
    isRegenTokenRefresh = true,
    setClientUser,
    setAlertMessage
  ) {
    setStatus(''); // clear status before attempting to check balance
    try {
      const url = `http://localhost:3001/account/user`;
      const res = await fetch(url, {
        headers: getAuthHeaderObj(),
      });
      let data = await res.json();
      if (data.error && isRegenTokenRefresh) {
        data = await handleTokenRefresh(data, handleCheckBalance);
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
      setBalance(data.balance);
      setShow(false);
    } catch (error) {
      console.error(error);
      setStatus('Error');
    }
  }

  function clearForm() {
    setShow(true);
  }
  return (
    <AppContext.Consumer>
      {({ setClientUser, setAlertMessage }) => (
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
                  onClick={() =>
                    handleCheckBalance(true, setClientUser, setAlertMessage)
                  }
                >
                  Check balance
                </button>
              </>
            ) : (
              <>
                <h5>Balance: {formatter.format(balance)}</h5>
                <button
                  type="submit"
                  className="btn btn-light"
                  onClick={clearForm}
                >
                  Check balance again
                </button>
              </>
            )
          }
        />
      )}
    </AppContext.Consumer>
  );
}
