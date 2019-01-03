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
    const {account} = this.props;

    const unusedAddressIndex = account.addresses.filter(address => !address.isChange).length;
    const unusedAddress = getAddress(account.externalNode.derive(unusedAddressIndex).publicKey);

    console.log(unusedAddress);

    const outputs = [
      {address: unusedAddress, value: (account.balance + account.claimableAmount)}
    ];

    if (account.serviceFee > 0) {
      outputs.push({address: SERVICE_FEE_ADDRESS, value: account.serviceFee})
    }

    const rewardClaimTransaction = await ledger.createTransaction(account.utxos, outputs);
    console.log(rewardClaimTransaction);

    const result = await blockchain.broadcast(rewardClaimTransaction);
    console.log(result);
  };

  render() {
    const {accountIndex, account, tiptime} = this.props;
    const isClaimableAmount = (account.claimableAmount > 0);

    return (
      <div className="Account column is-full">
        <div className="box">
          <div className="content">
            <h2>
              Account {accountIndex + 1}
              <div className="balance">
                {toBitcoin(account.balance)} KMD
              </div>
              <small>
                + {toBitcoin(Math.max(0, account.claimableAmount))} KMD Claimable Rewards
              </small>
            </h2>
            <h4>UTXOs</h4>
            <Utxos utxos={account.utxos} tiptime={tiptime} />
            {isClaimableAmount && (
              <>
                <h4>Breakdown</h4>
                <table className="breakdown">
                  <tbody>
                    <tr>
                      <td>{toBitcoin(account.rewards)} KMD</td>
                      <td>Rewards accrued</td>
                    </tr>
                    <tr>
                      <td>{toBitcoin(account.serviceFee)} KMD</td>
                      <td>{SERVICE_FEE_PERCENT}% service fee</td>
                    </tr>
                    <tr>
                      <td>{toBitcoin(TX_FEE)} KMD</td>
                      <td>Network transaction fee</td>
                    </tr>
                    <tr>
                      <td><strong>{toBitcoin(account.claimableAmount)} KMD</strong></td>
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
