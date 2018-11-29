import React from 'react';
import getKomodoRewards from './lib/get-komodo-rewards';
import {SERVICE_FEE_PERCENT} from './constants'
import {toBitcoin} from 'satoshi-bitcoin';

const Account = ({account, tiptime, utxos}) => {
  const balance = utxos.reduce((balance, utxo) => balance + utxo.satoshis, 0);
  const rewards = utxos.reduce((rewards, utxo) => rewards + getKomodoRewards({tiptime, ...utxo}), 0);
  const fee = Math.floor((rewards / 100) * SERVICE_FEE_PERCENT);

  return (
    <div className="Account">
      <h2>Account {account + 1}: {toBitcoin(balance)} KMD</h2>
      <h4>Total rewards are {toBitcoin(rewards)} KMD with a {SERVICE_FEE_PERCENT}% fee of {toBitcoin(fee)} KMD meaning you will be credited with an extra {toBitcoin(rewards - fee)} KMD</h4>
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
