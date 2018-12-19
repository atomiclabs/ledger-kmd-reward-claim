import ledger from './ledger';
import blockchain from './blockchain';
import {KOMODO} from './../constants';
import bitcoin from 'bitcoinjs-lib';

const getAddress = publicKey => bitcoin.payments.p2pkh({
  pubkey: publicKey,
  network: KOMODO
}).address;

const walkDerivationPath = async ({node, account, parentDerivationPath, isChange}) => {
  const addresses = [];
  const gapLimit = 20;
  let consecutiveUnusedAddresses = 0;
  let addressIndex = 0;

  while (consecutiveUnusedAddresses < gapLimit) {
    const derivationPath = `44'/141'/${account}'/${isChange ? 1 : 0}/${addressIndex}`;
    const addressString = getAddress(node.derive(addressIndex).publicKey);
    const address = await blockchain.getAddress(addressString);

    addresses.push({address: address.addrStr, account, isChange, addressIndex, derivationPath});

    if (address.totalReceived > 0 || address.unconfirmedBalance > 0) {
      consecutiveUnusedAddresses = 0;
    } else {
      consecutiveUnusedAddresses++;
    }

    addressIndex++;
  }

  return addresses.slice(0, addresses.length - gapLimit);
};

const getAccountAddresses = async account => {
  const derivationPath = `44'/141'/${account}'`;
  const xpub = await ledger.getXpub(derivationPath);
  const node = bitcoin.bip32.fromBase58(xpub);
  const externalNode = node.derive(0);
  const internalNode = node.derive(1);

  const [externalAddresses, internalAddresses] = await Promise.all([
    walkDerivationPath({node: externalNode, account, parentDerivationPath: derivationPath, isChange: false}),
    walkDerivationPath({node: internalNode, account, parentDerivationPath: derivationPath, isChange: true})
  ]);

  return [...externalAddresses, ...internalAddresses];
}

const accountDiscovery = async () => {
  let utxos = [];
  let account = 0;

  while (true) {
    const accountAddresses = await getAccountAddresses(account);
    if (accountAddresses.length === 0) {
      break;
    }

    const accountUtxos = await blockchain.getUtxos(accountAddresses.map(a => a.address));
    const accountUtxosFormatted = await Promise.all(accountUtxos.map(async utxo => {
      const addressInfo = accountAddresses.find(a => a.address === utxo.address);
      const {rawtx} = await blockchain.getRawTransaction(utxo.txid);
      const {locktime} = bitcoin.Transaction.fromHex(rawtx);

      return {
        id: `${utxo.txid}:${utxo.vout}`,
        ...addressInfo,
        ...utxo,
        locktime,
        rawtx
      };
    }));
    utxos = [...utxos, ...accountUtxosFormatted];

    account++;
  }

  return utxos;
};

export default accountDiscovery;
