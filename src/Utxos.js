import React from 'react';
import {toBitcoin} from 'satoshi-bitcoin';
import getKomodoRewards from './lib/get-komodo-rewards';

const Utxos = ({utxos, tiptime}) => (
  <table className="table">
    <thead>
      <tr>
        <th>Address</th>
        <th>Balance</th>
        <th>Locktime</th>
        <th>Rewards</th>
      </tr>
    </thead>
    <tbody>
      {utxos.map(utxo => (
        <tr key={utxo.id} className="utxo">
          <th>{utxo.address}</th>
          <td>{toBitcoin(utxo.satoshis)}</td>
          <td>{utxo.locktime}</td>
          <td>{toBitcoin(getKomodoRewards({tiptime, ...utxo}))}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Utxos;
