import React from 'react';
import {toBitcoin} from 'satoshi-bitcoin';
import getKomodoRewards from './lib/get-komodo-rewards';

const Utxo = ({utxo, tiptime}) => (
  <div className="Utxo">
    <strong>{utxo.address}</strong><br />
    <strong>Balance</strong> {toBitcoin(utxo.satoshis)}<br />
    <strong>Locktime</strong> {utxo.locktime}<br />
    <strong>Rewards</strong> {toBitcoin(getKomodoRewards({tiptime, ...utxo}))}<br />
    <br />
  </div>
);

export default Utxo;
