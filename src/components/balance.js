import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthHeaderObj, handleTokenRefresh, formatter } from '../util';
import AppContext from './app-context';

export default function Balance({ onSetStatus }) {
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();
  const { setAlertObj, setClientUser } = useContext(AppContext);

  useEffect(() => {
    setAlertObj(undefined);
  }, [setAlertObj]);

  useEffect(() => {
    async function handleCheckBalance(isRegenTokenRefresh = true) {
      onSetStatus && onSetStatus(''); // clear status before attempting to check balance
      try {
        const url = `${process.env.REACT_APP_WEB_SERVER_PROTOCOL}://localhost:${process.env.REACT_APP_WEB_SERVER_PORT}/account/user`;
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
            setAlertObj({
              message: 'Your session has expired. Please re-login.',
            });
            navigate('/Login');
          } else if (data && data.error) {
            onSetStatus && onSetStatus(data.error);
          }
          return;
        } else if (data.error) {
          onSetStatus && onSetStatus(data.error);
          return;
        }
        setClientUser({
          ...data,
        });
        setBalance(data.balance);
      } catch (error) {
        console.error(error);
        onSetStatus && onSetStatus('Error');
      }
    }
    handleCheckBalance();
  }, [navigate, setAlertObj, setClientUser, onSetStatus]);

  return <>{formatter.format(balance)}</>;
}
