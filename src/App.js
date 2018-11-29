import React from 'react';
import {hot} from 'react-hot-loader';
import accountDiscovery from './lib/account-discovery';
import blockchain from './lib/blockchain';
import Account from './Account';
import './App.css';

class App extends React.Component {
  state = {
    error: null,
    scanning: false,
    utxos: [],
    tiptime: null
  };

  scanAddresses = async () => {
    this.setState({
      error: null,
      scanning: true,
      utxos: [],
      tiptime: null
    });

    try {
      const utxos = await accountDiscovery();
      const tiptime = await blockchain.getTipTime();

      this.setState({
        error: null,
        scanning: false,
        utxos,
        tiptime
      });
    } catch (error) {
      this.setState({
        error,
        scanning: false
      });
    }
  };

  render() {
    const {utxos, tiptime, scanning, error} = this.state;
    const accounts = [...new Set(utxos.map(utxo => utxo.account))].sort((a, b) => a - b);

    return (
      <div className="App">
        <button onClick={() => this.scanAddresses()}>
          Scan Blockchain for Addresses
        </button>
        <div>
          {scanning && 'Scanning...'}
          {error && `Error: ${error.message}`}
          {tiptime}
        </div>
        {accounts.map(account => (
          <Account
            key={account}
            account={account}
            tiptime={tiptime}
            utxos={utxos.filter(utxo => utxo.account === account)}
            />
        ))}
      </div>
    );
  }
}

export default hot(module)(App);
