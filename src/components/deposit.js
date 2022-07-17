import { useState } from "react";
import Card from "./card";
import Balance from "./balance";
import AppContext from "./app-context";

export default function Deposit() {
  let [depositAmount, setDepositAmount] = useState(0);
  const [show, setShow] = useState(true);

  function handleDeposit({ balance, setBalance }) {
    if (!depositAmount) {
      depositAmount = 0;
    }
    const parsedDepositAmount = parseFloat(depositAmount);
    if (typeof parsedDepositAmount !== "number") {
      return alert("Deposit amount must be a number!");
    } else if (parsedDepositAmount < 0) {
      return alert("Can't deposit a negative amount!");
    } else if (parsedDepositAmount === 0) {
      return alert("Please enter an amount to deposit!");
    }
    setBalance(balance + parsedDepositAmount);
    setShow(false);
  }
  function clearForm() {
    setDepositAmount("0.00");
    setShow(true);
  }
  return (
    <AppContext.Consumer>
      {({ balance, setBalance }) => (
        <Card
          header="Deposit"
          bgcolor="warning"
          body={
            show ? (
              <>
                <Balance />
                <br />
                <br />
                Deposit Amount
                <br />
                <input
                  type="number"
                  className="form-control"
                  id="withdraw"
                  placeholder="0.00"
                  onChange={(e) => setDepositAmount(e.currentTarget.value)}
                />
                <br />
                <button
                  disabled={depositAmount ? false : true}
                  type="submit"
                  className="btn btn-light"
                  onClick={() => handleDeposit({ balance, setBalance })}
                >
                  {" "}
                  Deposit
                </button>
              </>
            ) : (
              <>
                <Balance />
                <br />
                <br />
                <h5>Deposit Successful</h5>
                <br />
                <button
                  type="submit"
                  className="btn btn-light"
                  onClick={clearForm}
                >
                  Make another deposit
                </button>
              </>
            )
          }
        />
      )}
    </AppContext.Consumer>
  );
}
