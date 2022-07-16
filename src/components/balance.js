import AppContext from "./app-context";

export default function Balance() {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return (
    <AppContext.Consumer>
      {({ balance }) => <>Balance: {formatter.format(balance)}</>}
    </AppContext.Consumer>
  );
}
