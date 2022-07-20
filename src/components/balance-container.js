import Card from './card';
import Balance from './balance';
import { useState } from 'react';

export default function BalanceContainer() {
  const [status, setStatus] = useState('');

  return (
    <Card
      bgcolor="light"
      txtcolor="black"
      header="Balance"
      status={status}
      body={
        <>
          <h5>
            <Balance onSetStatus={setStatus} />
          </h5>
        </>
      }
    />
  );
}
