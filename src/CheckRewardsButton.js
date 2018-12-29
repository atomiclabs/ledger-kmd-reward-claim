import React from 'react';
import ledger from './lib/ledger';
import accountDiscovery from './lib/account-discovery';
import blockchain from './lib/blockchain';

class CheckRewardsButton extends React.Component {
  state = this.initialState;

  get initialState() {
    return {
      status: null,
      isCheckingRewards: false
    };
  }

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

      this.props.handleRewardData({
        utxos,
        tiptime
      });

      this.setState({
        isCheckingRewards: false,
        status: 'Scan complete!'
      });
    } catch (error) {
      this.setState({
        isCheckingRewards: false,
        status: `Error: ${error.message}`
      });
    }
  };

  render() {
    return (
      <button className={`button is-primary ${this.state.isCheckingRewards && 'is-loading'}`} onClick={this.scanAddresses}>
        <strong>Check Rewards</strong>
      </button>
    );
  }

}

export default CheckRewardsButton;
