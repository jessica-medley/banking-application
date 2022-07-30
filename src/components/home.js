import Card from "./card";

export default function Home() {
  return (
    <Card
      txtcolor="black"
      header="Welcome to Incredibly Bad Bank"
      text="We will start you off with a $100 balance! Make deposits and withdraw as you need!"
      body={<img src="bank.png" className="img-fluid" alt="A bank" />}
    />
  );
}
