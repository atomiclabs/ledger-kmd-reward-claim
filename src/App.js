import React from 'react';
import {hot} from 'react-hot-loader';
import ledger from './lib/ledger';
import accountDiscovery from './lib/account-discovery';
import blockchain from './lib/blockchain';
import Account from './Account';
import './App.css';

class App extends React.Component {
  state = this.initialState;

  get initialState() {
    return {
      status: null,
      utxos: [],
      tiptime: null
    };
  }

  scanAddresses = async () => {
    this.setState({
      ...this.initialState,
      status: 'Checking Ledger is available...'
    });

    if (!(await ledger.isAvailable())) {
      this.setState({status: 'Error: Ledger device is unavailable!'});
      return;
    } else {
      this.setState({status: 'Scanning blockchain for funds...'});
    }

    try {
      const utxos = await accountDiscovery();
      const tiptime = await blockchain.getTipTime();

      this.setState({
        status: 'Scan complete!',
        utxos,
        tiptime
      });
    } catch (error) {
      this.setState({status: `Error: ${error.message}`});
    }
  };

  render() {
    const {utxos, tiptime, scanning, status} = this.state;
    const accounts = [...new Set(utxos.map(utxo => utxo.account))].sort((a, b) => a - b);

    return (
      <div className="App">
        <button onClick={() => this.scanAddresses()}>
          Scan Blockchain for Addresses
        </button>
        <div>
          {scanning && 'Scanning...'}
          {status && status}
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
