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
      error: false,
      actions: {
        connect: {
          icon: 'fab fa-usb',
          description: <div>Connect and unlock your Ledger, then open the Komodo app on your device.</div>,
          state: null
        },
        approve: {
          icon: 'fas fa-microchip',
          description: <div>Approve all public key export requests on your device. <strong>There will be multiple requests</strong>.</div>,
          state: null
        }
      }
    };
  }

  resetState = () => this.setState(this.initialState);

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
      this.setState(prevState => ({
        actions: update(prevState.actions, {
          connect: {state: {$set: false}},
        }),
        error: 'Ledger device is unavailable!'
      }));
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
      this.setState(prevState => ({
        actions: update(prevState.actions, {
          approve: {state: {$set: false}},
        }),
        error: error.message
      }));
    }
  };

  render() {
    const {isCheckingRewards, actions, error} = this.state;

    return (
      <>
        <button className="button is-primary" onClick={this.scanAddresses}>
          {this.props.children}
        </button>
        <ActionListModal
          title="Scanning Blockchain for Rewards"
          actions={actions}
          error={error}
          handleClose={this.resetState}
          show={isCheckingRewards} />
      </>
    );
  }

}

export default CheckRewardsButton;
