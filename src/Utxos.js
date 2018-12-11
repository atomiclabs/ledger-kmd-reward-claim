import React from 'react';
import {toBitcoin} from 'satoshi-bitcoin';
import getKomodoRewards from './lib/get-komodo-rewards';
import getRewardEndDate from './lib/get-reward-end-date';

const Utxos = ({utxos, tiptime}) => {
  const headings = ['Address', 'Balance', 'Locktime', 'Rewards', 'Rewards Stop Accruing'];

  return (
    <table className="table is-striped">
      <thead>
        <tr>
          {headings.map(heading => <th key={heading}>{heading}</th>)}
        </tr>
      </thead>
      <tfoot>
        <tr>
          {headings.map(heading => <th key={heading}>{heading}</th>)}
        </tr>
      </tfoot>
      <tbody>
        {utxos.map(utxo => (
          <tr key={utxo.id} className="utxo">
            <th>{utxo.address}</th>
            <td>{toBitcoin(utxo.satoshis)}</td>
            <td>{utxo.locktime}</td>
            <td>{toBitcoin(getKomodoRewards({tiptime, ...utxo}))}</td>
            <td>{getRewardEndDate(utxo)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Utxos;
