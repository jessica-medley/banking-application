import { useState } from "react";
import Card from "./card";
import Balance from "./balance";
import AppContext from "./app-context";

export default function Withdraw() {
  let [withdrawAmount, setWithdrawAmount] = useState(0);
  const [show, setShow] = useState(true);

  function handleWithdraw({ balance, setBalance }) {
    if (!withdrawAmount) {
      withdrawAmount = 0;
    }
    // withdrawAmount comes in as a string. We need to
    // be able to do math upon it, so we parse it into a number
    const parsedWithdrawAmount = parseFloat(withdrawAmount);
    if (typeof parsedWithdrawAmount !== "number") {
      return alert("Withdraw amount must be a number!");
    } else if (parsedWithdrawAmount < 0) {
      return alert("Can't withdraw a negative amount!");
    } else if (parsedWithdrawAmount === 0) {
      return alert("Please enter an amount to withdraw!");
    } else if (parsedWithdrawAmount > balance) {
      return alert("You're overdrawn!");
    }
    setBalance(balance - parsedWithdrawAmount);
    setShow(false);
  }
  function clearForm() {
    setWithdrawAmount("0.00");
    setShow(true);
  }
  return (
    <AppContext.Consumer>
      {({ balance, setBalance }) => (
        <Card
          txtcolor="black"
          header="Withdraw"
          body={
            show ? (
              <>
                <Balance />
                <br />
                <br />
                Withdraw Amount
                <br />
                <input
                  type="number"
                  className="form-control"
                  id="withdraw"
                  placeholder="0.00"
                  onChange={(e) => setWithdrawAmount(e.currentTarget.value)}
                />
                <br />
                <button
                  disabled={withdrawAmount ? false : true}
                  type="submit"
                  className="btn btn-light"
                  onClick={() => handleWithdraw({ balance, setBalance })}
                >
                  {" "}
                  Withdraw
                </button>
              </>
            ) : (
              <>
                <Balance />
                <br />
                <br />
                <h5>Withdraw Successful</h5>
                <br />
                <button
                  type="submit"
                  className="btn btn-light"
                  onClick={clearForm}
                >
                  Make another withdraw
                </button>
              </>
            )
          }
        />
      )}
    </AppContext.Consumer>
  );
}
