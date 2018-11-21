import React from 'react';

const Account = ({account, utxos}) => {
  const balance = utxos.reduce((balance, utxo) => balance + utxo.amount, 0);

  return (
    <div className="Account">
      <h2>Account {account + 1}: {balance} KMD</h2>
      {utxos.map(utxo => (
        <pre key={JSON.stringify(utxo)}>{JSON.stringify(utxo, null, 2)}</pre>
      ))}
    </div>
  );
};

export default Account;
