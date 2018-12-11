import React from 'react';
import {toBitcoin} from 'satoshi-bitcoin';
import getKomodoRewards from './lib/get-komodo-rewards';
import humanRewardEndDate from './lib/human-reward-end-date';

const Boolean = ({value}) => (
  <span className={`icon has-text-${value ? 'success' : 'danger'}`}>
    <i className={`fas fa-${value ? 'check' : 'times'}-circle`}></i>
  </span>
);

const Utxos = ({utxos, tiptime}) => {
  const headings = ['Address', 'Value', 'Locktime', 'Rewards', 'Rewards Stop Accruing'];


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
            <td>{toBitcoin(utxo.satoshis)} KMD</td>
            <td><Boolean value={utxo.locktime} /></td>
            <td>{toBitcoin(getKomodoRewards({tiptime, ...utxo}))} KMD</td>
            <td>{humanRewardEndDate(utxo)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Utxos;
