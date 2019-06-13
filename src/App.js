import React from 'react';
import {hot} from 'react-hot-loader';
import {isEqual} from 'lodash';
import Header from './Header';
import CheckRewardsButton from './CheckRewardsButton';
import Accounts from './Accounts';
import WarnU2fCompatibility from './WarnU2fCompatibility';
import Footer from './Footer';
import {repository} from '../package.json';
import './App.scss';

class App extends React.Component {
  state = this.initialState;

  get initialState() {
    return {
      accounts: [],
      tiptime: null
    };
  }

  resetState = () => this.setState(this.initialState);

  handleRewardData = ({accounts, tiptime}) => {
    this.setState({accounts, tiptime});
  };

  render() {
    return (
      <div className="App">
        <Header>
          <div className="buttons">
            <CheckRewardsButton handleRewardData={this.handleRewardData}>
              <strong>Check Rewards</strong>
            </CheckRewardsButton>
            <button className="button is-light" disabled={isEqual(this.state, this.initialState)} onClick={this.resetState}>
              Reset
            </button>
          </div>
        </Header>

        <section className="main">
          {this.state.accounts.length === 0 ? (
            <>
              <div className="container content">
                <h2>Claim your KMD rewards on your Ledger device.</h2>
                <h4>As a gift to the community, we have decided to make this service free! There is no longer a fee to claim rewards. ❤️</h4>
                <p>Make sure the KMD app and firmware on your Ledger are up to date, then connect your Ledger, open the KMD app, and click the "Check Rewards" button.</p>
              </div>
              <img className="ledger-graphic" src="ledger.svg" alt="Ledger Nano S"/>
            </>
          ) : (
            <Accounts {...this.state} />
          )}
        </section>

        <WarnU2fCompatibility />

        <Footer>
          <p>
            <strong>Ledger KMD Reward Claim</strong> by <a target="_blank" rel="noopener noreferrer" href="https://github.com/atomiclabs">Atomic Labs</a>.
            The <a target="_blank" rel="noopener noreferrer" href={`https://github.com/${repository}`}>source code</a> is licensed under <a target="_blank" rel="noopener noreferrer" href={`https://github.com/${repository}/blob/master/LICENSE`}>MIT</a>.
            <br />
            View the <a target="_blank" rel="noopener noreferrer" href={`https://github.com/${repository}#usage`}>README</a> for usage instructions.
          </p>
        </Footer>
      </div>
    );
  }
}

export default hot(module)(App);
