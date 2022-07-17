import React from 'react';
import Table from 'react-bootstrap/Table';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function AllData() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    // fetch all accounts from API
    fetch('/account/all')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
      // Without setting data as the state to monitor for change, I get an
      // infinite loop, calling the express server.
  }, data);

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, i) => {
            return (
              <tr key={`table-row-${i}`}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>{formatter.format(user.balance)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
