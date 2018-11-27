import React from 'react';
import {toBitcoin} from 'satoshi-bitcoin';

const Account = ({account, utxos}) => {
  const balance = utxos.reduce((balance, utxo) => balance + utxo.satoshis, 0);

  return (
    <div className="Account">
      <h2>Account {account + 1}: {toBitcoin(balance)} KMD</h2>
      {utxos.map(utxo => (
        <div key={utxo.id} className="UTXO">
          {utxo.address} {toBitcoin(utxo.satoshis)} {utxo.tx.locktime}
          <pre key={JSON.stringify(utxo)}>{JSON.stringify(utxo, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
};

export default Account;
