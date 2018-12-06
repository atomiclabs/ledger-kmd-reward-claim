import React from 'react';
import Utxo from './Utxo';
import getKomodoRewards from './lib/get-komodo-rewards';
import ledger from './lib/ledger';
import {SERVICE_FEE_ADDRESS, SERVICE_FEE_PERCENT, TX_FEE} from './constants';
import {toBitcoin} from 'satoshi-bitcoin';

class Account extends React.Component {
  getBalance = () => this.props.utxos.reduce((balance, utxo) => balance + utxo.satoshis, 0);

  getRewards = () => this.props.utxos.reduce((rewards, utxo) => rewards + getKomodoRewards({tiptime: this.props.tiptime, ...utxo}), 0);

  getServiceFee = () => Math.floor((this.getRewards() / 100) * SERVICE_FEE_PERCENT);

  getClaimableAmount = () => this.getRewards() - this.getServiceFee() - TX_FEE;

  claimRewards = async () => {
    const {account, utxos} = this.props;

    const unusedAddressIndex = utxos.reduce((index, utxo) => (!utxo.isChange && utxo.addressIndex > index) ? utxo.addressIndex : index, 0) + 1;
    const derivationPath = `44'/141'/${account}'/0/${unusedAddressIndex}`;
    const unusedAddress = await ledger.getAddress(derivationPath);

    const outputs = [
      {address: unusedAddress, value: (this.getBalance() + this.getClaimableAmount())}
    ];

    const serviceFee = this.getServiceFee();
    if (serviceFee > 0) {
      outputs.push({address: SERVICE_FEE_ADDRESS, value: serviceFee})
    }

    const rewardClaimTransaction = await ledger.createTransaction(utxos, outputs);

    console.log(rewardClaimTransaction);
  };

  render() {
    const {account, utxos, tiptime} = this.props;

    return (
      <div className="Account">
        <h2>Account {account + 1}: {toBitcoin(this.getBalance())} KMD</h2>
        <button onClick={this.claimRewards}>
          Claim Rewards
        </button>
        <p>
          Rewards accrued: {toBitcoin(this.getRewards())} KMD<br />
          Minus {toBitcoin(this.getServiceFee())} KMD {SERVICE_FEE_PERCENT}% service fee.<br />
          Minus {toBitcoin(TX_FEE)} KMD network transaction fee.<br />
          Total claimable amount: {toBitcoin(this.getClaimableAmount())} KMD.
        </p>
        {utxos.map(utxo => <Utxo key={utxo.id} utxo={utxo} tiptime={tiptime} />)}
      </div>
    );
  }
}

export default Account;
