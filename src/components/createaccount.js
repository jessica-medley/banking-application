import React from "react";
import Card from "./card";
import AppContext from "./app-context";

export default function CreateAccount() {
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  // const ctx = React.useContext(AppContext);

  function validate(field, label) {
    if (!field) {
      setStatus(alert("Error: Please enter " + label));
      setTimeout(() => setStatus(""), 3000);
      return false;
    }
    return true;
  }
  function passwordLength(password) {
    if (password.length >= 8) {
      return true;
    } else {
      return false;
    }
  }
  function handleCreate({ users, setUsers }) {
    console.log(name, email, password);
    if (!validate(name, "name")) return;
    if (!validate(email, "email")) return;
    if (!validate(password, "password")) return;
    if (!passwordLength(password)) {
      alert("Password must be at least 8 characters long");
      return;
    }
    users.push({ name, email, password });
    setUsers(users);
    setShow(false);
  }

  function clearForm() {
    setName("");
    setEmail("");
    setPassword("");
    setShow(true);
  }
  return (
    <AppContext.Consumer>
      {({ users, setUsers }) => (
        <Card
          txtcolor="black"
          header="Create Account"
          status={status}
          body={
            show ? (
              <>
                Name
                <br />
                <input
                  type="input"
                  className="form-control"
                  id="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                />
                <br />
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
                  disabled={!name || !email || !password}
                  type="submit"
                  className="btn btn-light"
                  onClick={() => handleCreate({ users, setUsers })}
                >
                  Create Account
                </button>
              </>
            ) : (
              <>
                <h5>Success</h5>
                <button
                  type="submit"
                  className="btn btn-light"
                  onClick={clearForm}
                >
                  Add another account
                </button>
              </>
            )
          }
        />
      )}
    </AppContext.Consumer>
  );
}
