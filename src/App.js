import React, { Component } from "react";
import web3 from "./web3";
import logo from "./logo.svg";
import "./App.css";
import lottery from "./lottery";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { manager: "", players: [], balance: "", value: "" };
  }
  async componentDidMount() {
    const [manager, players, balance] = await Promise.all([
      lottery.methods.manager().call(),
      lottery.methods.getPlayers().call(),
      web3.eth.getBalance(lottery.options.address),
    ]);
    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "You have been entered!" });
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager}</p>
        <p>
          There are currently {this.state.players.length} people entered,
          competing to win {web3.utils.fromWei(this.state.balance, "ether")}{" "}
          ether!
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={(event) =>
                this.setState({
                  value: event.target.value,
                })
              }
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4>Ready to pick a winner?</h4>
        <button
          onClick={async () => {
            const accounts = await web3.eth.getAccounts();
            this.setState({ message: "Waiting on transaction success..." });
            await lottery.methods.pickWinner().send({
              from: accounts[0],
            });
            this.setState({ message: "A winner has been picked!" });
          }}
        >
          Pick a winner!
        </button>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
