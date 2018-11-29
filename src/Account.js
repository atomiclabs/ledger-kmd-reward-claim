import React from 'react';
import getKomodoRewards from './lib/get-komodo-rewards';
import {SERVICE_FEE_PERCENT, TX_FEE} from './constants'
import {toBitcoin} from 'satoshi-bitcoin';

const Account = ({account, tiptime, utxos}) => {
  const balance = utxos.reduce((balance, utxo) => balance + utxo.satoshis, 0);
  const rewards = utxos.reduce((rewards, utxo) => rewards + getKomodoRewards({tiptime, ...utxo}), 0);
  const fee = Math.floor((rewards / 100) * SERVICE_FEE_PERCENT);

  return (
    <div className="Account">
      <h2>Account {account + 1}: {toBitcoin(balance)} KMD</h2>
      <p>
        Rewards accrued: {toBitcoin(rewards)} KMD<br />
        Minus {toBitcoin(fee)} KMD {SERVICE_FEE_PERCENT}% service fee.<br />
        Minus {toBitcoin(TX_FEE)} KMD network transaction fee.<br />
        Total claimable amount: {toBitcoin(rewards - fee - TX_FEE)} KMD.
      </p>
      {utxos.map(utxo => (
        <div key={utxo.id} className="UTXO">
          <strong>{utxo.address}</strong><br />
          <strong>Balance</strong> {toBitcoin(utxo.satoshis)}<br />
          <strong>Locktime</strong> {utxo.locktime}<br />
          <strong>Rewards</strong> {toBitcoin(getKomodoRewards({tiptime, ...utxo}))}<br />
          <br />
        </div>
      ))}
    </div>
  );
};

export default Account;
