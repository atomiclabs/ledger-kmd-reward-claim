import React from 'react';
import ledger from './lib/ledger';
import blockchain from './lib/blockchain';
import getAddress from './lib/get-address';
import {SERVICE_FEE_ADDRESS} from './constants';

class ClaimRewardsButton extends React.Component {
  claimRewards = async () => {
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

    const rewardClaimTransaction = await ledger.createTransaction(utxos, outputs);
    console.log(rewardClaimTransaction);

    const result = await blockchain.broadcast(rewardClaimTransaction);
    console.log(result);
  };

  render() {
    const isClaimableAmount = (this.props.account.claimableAmount > 0);

    return (
      <button className="button is-primary" disabled={!isClaimableAmount} onClick={this.claimRewards}>
        {this.props.children}
      </button>
    );
  }
}

export default ClaimRewardsButton;
