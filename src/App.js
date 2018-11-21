import React from 'react';
import {hot} from 'react-hot-loader';
import accountDiscovery from './lib/account-discovery';
import Account from './Account';
import './App.css';

class App extends React.Component {
  state = {
    scanning: false,
    utxos: []
  };

  scanAddresses = async () => {
    this.setState({
      scanning: true,
      utxos: []
    });

    const utxos = await accountDiscovery();

    this.setState({
      scanning: false,
      utxos
    });
  };

  render() {
    const {utxos, scanning} = this.state;
    const accounts = [...new Set(utxos.map(utxo => utxo.account))].sort((a, b) => a - b);

    return (
      <div className="App">
        <button onClick={() => this.scanAddresses()}>
          Scan Blockchain for Addresses
        </button>
        <div>
          {scanning && 'Scanning...'}
        </div>
        {accounts.map(account => (
          <Account
            key={account}
            account={account}
            utxos={utxos.filter(utxo => utxo.account === account)}
            />
        ))}
      </div>
    );
  }
}

export default hot(module)(App);
