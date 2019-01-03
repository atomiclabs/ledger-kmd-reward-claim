import React from 'react';
import update from 'immutability-helper';
import ActionListModal from './ActionListModal';
import ledger from './lib/ledger';
import blockchain from './lib/blockchain';
import getAddress from './lib/get-address';
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

    this.setState(prevState => ({
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

    let rewardClaimTransaction;
    try {
      this.setState(prevState => ({
        actions: update(prevState.actions, {
          connect: {state: {$set: true}},
          approveTransaction: {state: {$set: 'loading'}}
        })
      }));

      rewardClaimTransaction = await ledger.createTransaction(utxos, outputs);
      console.log(rewardClaimTransaction);
    } catch (error) {
      this.setState(prevState => ({
        actions: update(prevState.actions, {
          approveTransaction: {state: {$set: false}},
        }),
        error: error.message
      }));
    }

    try {
      this.setState(prevState => ({
        actions: update(prevState.actions, {
          approveTransaction: {state: {$set: true}},
          broadcastTransaction: {state: {$set: 'loading'}}
        })
      }));

      const result = await blockchain.broadcast(rewardClaimTransaction);
      console.log(result);

      // this.props.handleRewardClaim();

      this.setState({...this.initialState});
    } catch (error) {
      this.setState(prevState => ({
        actions: update(prevState.actions, {
          broadcastTransaction: {state: {$set: false}},
        }),
        error: error.message
      }));
    }
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
