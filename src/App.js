import React from 'react';
import {hot} from 'react-hot-loader';
import ledger from './lib/ledger';
import accountDiscovery from './lib/account-discovery';
import blockchain from './lib/blockchain';
import Header from './Header';
import Accounts from './Accounts';
import Footer from './Footer';
import './App.css';

class App extends React.Component {
  state = this.initialState;

  get initialState() {
    return {
      status: null,
      utxos: [],
      tiptime: null,
      isCheckingRewards: false
    };
  }

  resetState = () => this.setState(this.initialState);

  scanAddresses = async () => {
    this.setState({
      ...this.initialState,
      isCheckingRewards: true,
      status: 'Checking Ledger is available...'
    });

    const ledgerIsAvailable = await ledger.isAvailable();
    if (!ledgerIsAvailable) {
      this.setState({
        isCheckingRewards: false,
        status: 'Error: Ledger device is unavailable!'
      });
      return;
    }

    this.setState({status: 'Scanning blockchain for funds...'});
    try {
      const utxos = await accountDiscovery();
      const tiptime = await blockchain.getTipTime();

      this.setState({
        isCheckingRewards: false,
        status: 'Scan complete!',
        utxos,
        tiptime
      });
    } catch (error) {
      this.setState({
        isCheckingRewards: false,
        status: `Error: ${error.message}`
      });
    }
  };

  render() {
    const {isCheckingRewards, utxos, tiptime, status} = this.state;

    return (
      <div className="App">
        <Header
          checkRewards={this.scanAddresses}
          resetState={this.resetState}
          isCheckingRewards={isCheckingRewards}
          />

        <section className="main">
          <Accounts
            utxos={utxos}
            tiptime={tiptime}
            />
        </section>

        <Footer />
      </div>
    );
  }
}

export default hot(module)(App);
