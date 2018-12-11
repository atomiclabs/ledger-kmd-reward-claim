import React from 'react';
import Utxos from './Utxos';
import getKomodoRewards from './lib/get-komodo-rewards';
import ledger from './lib/ledger';
import {SERVICE_FEE_ADDRESS, SERVICE_FEE_PERCENT, TX_FEE} from './constants';
import {toBitcoin} from 'satoshi-bitcoin';
import './Accounts.css';
import './Account.css';

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
      <div className="Account column is-full">
        <div className="box">
          <div className="content">
            <h2>
              Account {account + 1}
              <div className="balance">
                {toBitcoin(this.getBalance())} KMD
              </div>
            </h2>
            <table className="breakdown">
              <tbody>
                <tr>
                  <td>{toBitcoin(this.getRewards())} KMD</td>
                  <td>Rewards accrued</td>
                </tr>
                <tr>
                  <td>{toBitcoin(this.getServiceFee())} KMD</td>
                  <td>{SERVICE_FEE_PERCENT}% service fee</td>
                </tr>
                <tr>
                  <td>{toBitcoin(TX_FEE)} KMD</td>
                  <td>Network transaction fee</td>
                </tr>
                <tr>
                  <td><strong>{toBitcoin(this.getClaimableAmount())} KMD</strong></td>
                  <td>Total claimable amount</td>
                </tr>
              </tbody>
            </table>
            <h4>UTXOs</h4>
            <Utxos utxos={utxos} tiptime={tiptime} />
            <button className="button is-primary" onClick={this.claimRewards}>
              Claim Rewards
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const Accounts = ({utxos, tiptime}) => {
  const accounts = [...new Set(utxos.map(utxo => utxo.account))].sort((a, b) => a - b);

  return (
    <div className="Accounts">
      <div className="container">
        <div className="columns is-multiline">
          {accounts.map(account => (
            <Account
              key={account}
              account={account}
              tiptime={tiptime}
              utxos={utxos.filter(utxo => utxo.account === account)}
              />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accounts;
