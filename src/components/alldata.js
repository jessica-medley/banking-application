import AppContext from "./app-context";
import Table from "react-bootstrap/Table";

export default function AllData() {
  return (
    <AppContext.Consumer>
      {({ users }) => {
        const tableRows = users.map((users, i) => {
          return (
            <tr key={`table-row-${i}`}>
              <td>{users.name}</td>
              <td>{users.email}</td>
              <td>{users.password}</td>
            </tr>
          );
        });
        return (
          <div>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>{tableRows}</tbody>
            </Table>
          </div>
        );
      }}
    </AppContext.Consumer>
  );
}
