import React from 'react';
import {hot} from 'react-hot-loader';
import Header from './Header';
import CheckRewardsButton from './CheckRewardsButton';
import Accounts from './Accounts';
import WarnU2fCompatibility from './WarnU2fCompatibility';
import Footer from './Footer';
import './App.scss';

class App extends React.Component {
  state = this.initialState;

  get initialState() {
    return {
      utxos: [],
      tiptime: null
    };
  }

  resetState = () => this.setState(this.initialState);

  handleRewardData = ({utxos, tiptime}) => {
    this.setState({utxos, tiptime});
  };

  render() {
    return (
      <div className="App">
        <Header>
          <div className="buttons">
            <CheckRewardsButton handleRewardData={this.handleRewardData}>
              <strong>Check Rewards</strong>
            </CheckRewardsButton>
            <button className="button is-light" onClick={this.resetState}>
              Reset
            </button>
          </div>
        </Header>

        <section className="main">
          <Accounts {...this.state} />
        </section>

        <WarnU2fCompatibility />

        <Footer>
          <p>
            <strong>Ledger KMD Reward Claim</strong> by <a target="_blank" rel="noopener noreferrer" href="https://github.com/atomiclabs">Atomic Labs</a>.
            The <a target="_blank" rel="noopener noreferrer" href="https://github.com/atomiclabs/komodo-ledger-reward-claim">source code</a> is licensed under <a target="_blank" rel="noopener noreferrer" href="https://github.com/atomiclabs/komodo-ledger-reward-claim/blob/master/LICENSE">MIT</a>.
          </p>
        </Footer>
      </div>
    );
  }
}

export default hot(module)(App);
