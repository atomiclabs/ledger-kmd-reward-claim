import React from 'react';
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
    return (
      <div className="App">
        <button onClick={() => this.scanAddresses()}>
          Scan Blockchain for Addresses
        </button>
        <div>
          {scanning && 'Scanning...'}
        </div>
        {addresses.map(address => (
          <pre key={address.addrStr}>{JSON.stringify(address)}</pre>
        ))}
      </div>
    );
  }
}

export default App;
