import React from 'react';
import {hot} from 'react-hot-loader';
import accountDiscovery from './lib/account-discovery';
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
          <React.Fragment key={account}>
            <h2>Account {account + 1}</h2>
            {utxos.filter(utxo => utxo.account === account).map(utxo => (
              <pre key={JSON.stringify(utxo)}>{JSON.stringify(utxo)}</pre>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  }
}

export default hot(module)(App);
