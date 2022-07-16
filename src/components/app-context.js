import React from "react";

// set the defaults
const AppContext = React.createContext({
  users: [],
  setUsers: () => {},
  balance: 100,
  setBalance: () => {},
});

export default AppContext;
