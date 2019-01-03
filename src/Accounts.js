import React from 'react';
import Utxos from './Utxos';
import ledger from './lib/ledger';
import blockchain from './lib/blockchain';
import getAddress from './lib/get-address';
import {SERVICE_FEE_ADDRESS, SERVICE_FEE_PERCENT, TX_FEE} from './constants';
import {toBitcoin} from 'satoshi-bitcoin';
import './Accounts.scss';
import './Account.scss';

class Account extends React.Component {
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
    const {accountIndex, account, tiptime} = this.props;
    const {
      utxos,
      balance,
      rewards,
      claimableAmount,
      serviceFee
    } = account;

    const isClaimableAmount = (claimableAmount > 0);

    return (
      <div className="Account column is-full">
        <div className="box">
          <div className="content">
            <h2>
              Account {accountIndex + 1}
              <div className="balance">
                {toBitcoin(balance)} KMD
              </div>
              <small>
                + {toBitcoin(Math.max(0, claimableAmount))} KMD Claimable Rewards
              </small>
            </h2>
            <h4>UTXOs</h4>
            <Utxos utxos={utxos} tiptime={tiptime} />
            {isClaimableAmount && (
              <>
                <h4>Breakdown</h4>
                <table className="breakdown">
                  <tbody>
                    <tr>
                      <td>{toBitcoin(rewards)} KMD</td>
                      <td>Rewards accrued</td>
                    </tr>
                    <tr>
                      <td>{toBitcoin(serviceFee)} KMD</td>
                      <td>{SERVICE_FEE_PERCENT}% service fee</td>
                    </tr>
                    <tr>
                      <td>{toBitcoin(TX_FEE)} KMD</td>
                      <td>Network transaction fee</td>
                    </tr>
                    <tr>
                      <td><strong>{toBitcoin(claimableAmount)} KMD</strong></td>
                      <td>Total claimable amount</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
            <button className="button is-primary" disabled={!isClaimableAmount} onClick={this.claimRewards}>
              Claim Rewards
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const Accounts = ({accounts, tiptime}) => (
  <div className="Accounts">
    <div className="container">
      <div className="columns is-multiline">
        {accounts.map((account, accountIndex) => (
          <Account
            key={accountIndex}
            accountIndex={accountIndex}
            account={account}
            tiptime={tiptime}
            />
        ))}
      </div>
    </div>
  </div>
);

export default Accounts;
