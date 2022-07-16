import React from "react";
import Card from "./card";
import AppContext from "./app-context";

export default function Login() {
  const [show, setShow] = React.useState(true);
  // const [status, setStatus] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  // function validate(field, label) {
    // if (!field) {
    //   setStatus(alert("Error: Please enter " + label));
    //   setTimeout(() => setStatus(""), 3000);
    //   return false;
    // }
    // return true;
  // }
  // function passwordLength(password) {
    // if (password.length >= 8) {
    //   return true;
    // } else {
    //   return false;
    // }
  // }
  function handleLogin({ users, setUsers }) {
    // console.log(email, password);
    // if (!validate(email, "email")) return;
    // if (!validate(password, "password")) return;
    // if (!passwordLength(password)) {
    //   alert("Password must be at least 8 characters long");
    //   return;
    // }
    // setUsers(users);
    // setShow(false);
  }

  function clearForm() {
    setEmail("");
    setPassword("");
    setShow(true);
  }
  return (
    <AppContext.Consumer>
      {({ users, setUsers }) => (
        <Card
          txtcolor="black"
          header="Login"
          // status={status}
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
                Password
                <br />
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <br />
                <button
                  disabled={!email || !password}
                  type="submit"
                  className="btn btn-light"
                  onClick={() => handleLogin({ users, setUsers })}
                >
                  Login
                </button>
              </>
            ) : (
              <>
                <h5>Success</h5>
                {/* <button
                  type="submit"
                  className="btn btn-light"
                  onClick={clearForm}
                >
                  Add another account
                </button> */}
              </>
            )
          }
        />
      )}
    </AppContext.Consumer>
  );
}
