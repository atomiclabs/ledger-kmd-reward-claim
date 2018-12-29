import React from 'react';
import {hot} from 'react-hot-loader';
import { ReactComponent as KmdIcon } from 'cryptocurrency-icons/svg/color/kmd.svg';
import ledger from './lib/ledger';
import accountDiscovery from './lib/account-discovery';
import blockchain from './lib/blockchain';
import Accounts from './Accounts';
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

        <nav class="navbar is-fixed-top" role="navigation" aria-label="main navigation" style={{boxShadow: '0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1)'}}>
          <div className="container">
            <div class="navbar-brand">
            <div class="navbar-item">
              <KmdIcon className="KmdIcon"/>
            </div>
            <h1 class="navbar-item">
              <strong>Ledger KMD Reward Claim</strong>
            </h1>
            </div>

            <div class="navbar-menu">
              <div class="navbar-end">
                <div class="navbar-item">
                  <div class="buttons">
                    <button className={`button is-primary ${isCheckingRewards && 'is-loading'}`} onClick={this.scanAddresses}>
                      <strong>Check Rewards</strong>
                    </button>
                    <button className="button is-light" onClick={this.resetState}>
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <section className="main">
          <Accounts
            utxos={utxos}
            tiptime={tiptime}
            />
        </section>


        <footer class="footer">
          <div class="content has-text-centered">
            <p>
              <strong>Ledger KMD Reward Claim</strong> by <a target="_blank" rel="noopener noreferrer" href="https://github.com/atomiclabs">Atomic Labs</a>.
              The <a target="_blank" rel="noopener noreferrer" href="https://github.com/atomiclabs/komodo-ledger-reward-claim">source code</a> is licensed under <a target="_blank" rel="noopener noreferrer" href="https://github.com/atomiclabs/komodo-ledger-reward-claim/blob/master/LICENSE">MIT</a>.
            </p>
          </div>
        </footer>

      </div>
    );
  }
}

export default hot(module)(App);
