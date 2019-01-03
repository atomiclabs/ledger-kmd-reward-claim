import React from 'react';
import ActionListModal from './ActionListModal';
import ledger from './lib/ledger';
import blockchain from './lib/blockchain';
import getAddress from './lib/get-address';
import updateActionState from './lib/update-action-state';
import {SERVICE_FEE_ADDRESS} from './constants';

class ClaimRewardsButton extends React.Component {
  state = this.initialState;

  get initialState() {
    return {
      isClaimingRewards: false,
      error: false,
      actions: {
        connect: {
          icon: 'fab fa-usb',
          description: <div>Connect and unlock your Ledger, then open the Komodo app on your device.</div>,
          state: null
        },
        approveTransaction: {
          icon: 'fas fa-search-dollar',
          description: <div>Approve the transaction on your device after carefully checking the values and addresses.</div>,
          state: null
        },
        broadcastTransaction: {
          icon: 'fas fa-broadcast-tower',
          description: <div>Broadcasting the reward claim transaction to the network.</div>,
          state: null
        }
      }
    };
  }

  resetState = () => this.setState(this.initialState);

  claimRewards = async () => {
    this.setState(prevState => ({
      ...this.initialState,
      isClaimingRewards: true,
    }));

    const {
      addresses,
      utxos,
      balance,
      claimableAmount,
      serviceFee,
      externalNode
    } = this.props.account;

    const unusedAddressIndex = addresses.filter(address => !address.isChange).length;
    const unusedAddress = getAddress(externalNode.derive(unusedAddressIndex).publicKey);
    console.log(unusedAddress);

    const outputs = [
      {address: unusedAddress, value: (balance + claimableAmount)}
    ];

    if (serviceFee > 0) {
      outputs.push({address: SERVICE_FEE_ADDRESS, value: serviceFee})
    }

    updateActionState(this, 'connect', 'loading');
    const ledgerIsAvailable = await ledger.isAvailable();
    if (!ledgerIsAvailable) {
      updateActionState(this, 'connect', false);
      this.setState({error: 'Ledger device is unavailable!'});
      return;
    }
    updateActionState(this, 'connect', true);

    updateActionState(this, 'approveTransaction', 'loading');
    let rewardClaimTransaction;
    try {
      rewardClaimTransaction = await ledger.createTransaction(utxos, outputs);
      console.log(rewardClaimTransaction);
    } catch (error) {
      updateActionState(this, 'approveTransaction', false);
      this.setState({error: error.message});
      return;
    }
    updateActionState(this, 'approveTransaction', true);

    updateActionState(this, 'broadcastTransaction', 'loading');
    try {
      const result = await blockchain.broadcast(rewardClaimTransaction);
      console.log(result);

      // this.props.handleRewardClaim();
    } catch (error) {
      updateActionState(this, 'broadcastTransaction', false);
      this.setState({error: error.message});
      return;
    }
    updateActionState(this, 'broadcastTransaction', true);

    this.setState({...this.initialState});
  };

  render() {
    const {isClaimingRewards, actions, error} = this.state;
    const isClaimableAmount = (this.props.account.claimableAmount > 0);

    return (
      <>
        <button className="button is-primary" disabled={!isClaimableAmount} onClick={this.claimRewards}>
          {this.props.children}
        </button>
        <ActionListModal
          title="Claiming Rewards"
          actions={actions}
          error={error}
          handleClose={this.resetState}
          show={isClaimingRewards} />
      </>
    );
  }
}

export default ClaimRewardsButton;
