import React from 'react';
import {hot} from 'react-hot-loader';
import accountDiscovery from './lib/account-discovery';
import './App.css';

class App extends React.Component {
  state = {
    scanning: false,
    addresses: []
  };

  scanAddresses = async () => {
    this.setState({scanning: true});

    const addresses = await accountDiscovery();

    this.setState({
      scanning: false,
      addresses
    });
  };

  render() {
    const {addresses, scanning} = this.state;
    const accounts = [...new Set(addresses.map(address => address.account))].sort((a, b) => a - b);

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
            {addresses.filter(address => address.account === account).map(address => (
              <pre key={address.addrStr}>{JSON.stringify(address)}</pre>
            ))}
          </React.Fragment>
        ))}
      </div>
    );
  }
}

export default hot(module)(App);
