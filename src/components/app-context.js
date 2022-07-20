import React from "react";

// set the defaults
const AppContext = React.createContext({
  signedIn: false,
  setSignedIn: () => {},
  clientUser: undefined,
  setClientUser: () => {},
  alertMessage: '',
  setAlertMessage: () => {},
});

export default AppContext;
