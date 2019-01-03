import React from 'react';
import Utxos from './Utxos';
import ClaimRewardsButton from './ClaimRewardsButton';
import {SERVICE_FEE_PERCENT, TX_FEE} from './constants';
import {toBitcoin} from 'satoshi-bitcoin';
import './Accounts.scss';
import './Account.scss';

class Account extends React.Component {
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
            <ClaimRewardsButton account={account}>
              Claim Rewards Component
            </ClaimRewardsButton>
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
