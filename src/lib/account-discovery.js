import ledger from './ledger';
import blockchain from './blockchain';
import {KOMODO} from './../constants';
import bitcoin from 'bitcoinjs-lib';

const getAddress = publicKey => bitcoin.payments.p2pkh({
  pubkey: publicKey,
  network: KOMODO
}).address;

const walkDerivationPath = async node => {
  const addressConcurrency = 10;
  const gapLimit = 20;
  const addresses = [];
  let consecutiveUnusedAddresses = 0;
  let addressIndex = 0;

  while (consecutiveUnusedAddresses < gapLimit) {
    const addressApiRequests = [];

    for (let i = 0; i < addressConcurrency; i++) {
      const address = getAddress(node.derive(addressIndex).publicKey);

      addressApiRequests.push(blockchain.getAddress(address));
      addresses.push({address, addressIndex});

      addressIndex++;
    }

    for (const address of await Promise.all(addressApiRequests)) {
      if (address.totalReceived > 0 || address.unconfirmedBalance > 0) {
        consecutiveUnusedAddresses = 0;
      } else {
        consecutiveUnusedAddresses++;
      }
    }
  }

  return addresses.slice(0, addresses.length - consecutiveUnusedAddresses);
};

const getAccountAddresses = async account => {
  const derivationPath = `44'/141'/${account}'`;
  const xpub = await ledger.getXpub(derivationPath);
  const node = bitcoin.bip32.fromBase58(xpub);
  const externalNode = node.derive(0);
  const internalNode = node.derive(1);

  const [externalAddresses, internalAddresses] = await Promise.all([
    walkDerivationPath(externalNode),
    walkDerivationPath(internalNode)
  ]);

  const addAddressMeta = ({isChange}) => {
    return address => ({
      ...address,
      account,
      isChange,
      derivationPath: `${derivationPath}/${isChange ? 1 : 0}/${address.addressIndex}`
    });
  };

  return [
    ...externalAddresses.map(addAddressMeta({isChange: false})),
    ...internalAddresses.map(addAddressMeta({isChange: true}))
  ];
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
