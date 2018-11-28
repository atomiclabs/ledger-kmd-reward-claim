import React from 'react';
import {toBitcoin} from 'satoshi-bitcoin';

const Account = ({account, utxos}) => {
  const balance = utxos.reduce((balance, utxo) => balance + utxo.satoshis, 0);

  return (
    <div className="Account">
      <h2>Account {account + 1}: {toBitcoin(balance)} KMD</h2>
      {utxos.map(utxo => (
        <div key={utxo.id} className="UTXO">
          <h3>{utxo.address}</h3>
          <strong>Balance</strong> {toBitcoin(utxo.satoshis)}<br />
          <strong>Locktime</strong> {utxo.locktime}<br />
          <strong>Rewards</strong> {toBitcoin(utxo.rewards)}<br />
          <pre>{JSON.stringify(utxo )}</pre>
        </div>
      ))}
    </div>
  );
};

export default Account;
