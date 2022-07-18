import React from 'react';
import Table from 'react-bootstrap/Table';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function AllData() {
  const [data, setData] = React.useState([]);


  // fetch all accounts from API
  async function getAllData() {
    try {
      const url = `http://localhost:3001/account/all`;
      const res = await fetch(url);
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error(error);
    }
  }

  React.useEffect(() => {
    getAllData();
      // Without setting data as the state to monitor for change, I get an
      // infinite loop, calling the express server.
  }, []);

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
