import React from 'react';
import update from 'immutability-helper';
import ledger from './lib/ledger';
import accountDiscovery from './lib/account-discovery';
import blockchain from './lib/blockchain';
import ActionListModal from './ActionListModal';

class CheckRewardsButton extends React.Component {
  state = this.initialState;

  get initialState() {
    return {
      isCheckingRewards: false,
      actions: {
        connect: {
          icon: 'fab fa-usb',
          text: 'Connect and unlock your Ledger, then open the Komodo app on your device.',
          state: null
        },
        approve: {
          icon: 'fas fa-microchip',
          text: 'Approve all public key export requests on your device. There will be multiple requests.',
          state: null
        }
      }
    };
  }

  scanAddresses = async () => {
    this.setState(prevState => ({
      ...this.initialState,
      isCheckingRewards: true,
      actions: update(prevState.actions, {
        connect: {state: {$set: 'loading'}},
      })
    }));

    const ledgerIsAvailable = await ledger.isAvailable();
    if (!ledgerIsAvailable) {
      this.setState({
        ...this.initialState,
        status: 'Error: Ledger device is unavailable!'
      });
      return;
    }

    this.setState(prevState => ({
      actions: update(prevState.actions, {
        connect: {state: {$set: true}},
        approve: {state: {$set: 'loading'}}
      })
    }));
    try {
      const utxos = await accountDiscovery();
      const tiptime = await blockchain.getTipTime();

      this.props.handleRewardData({
        utxos,
        tiptime
      });

      this.setState({...this.initialState});
    } catch (error) {
      this.setState({
        ...this.initialState,
        status: `Error: ${error.message}`
      });
    }
  };

  render() {
    const {isCheckingRewards, actions} = this.state;

    return (
      <>
        <button className={`button is-primary ${isCheckingRewards && 'is-loading'}`} onClick={this.scanAddresses}>
          {this.props.children}
        </button>
        <ActionListModal
          title="Scanning Blockchain for Rewards"
          actions={actions}
          show={isCheckingRewards} />
      </>
    );
  }

}

export default CheckRewardsButton;
