import React from 'react';

const Account = ({account, utxos}) => {
  return (
    <div className="Account">
      <h2>Account {account + 1}</h2>
      {utxos.map(utxo => (
        <pre key={JSON.stringify(utxo)}>{JSON.stringify(utxo, null, 2)}</pre>
      ))}
    </div>
  );
};

export default Account;
