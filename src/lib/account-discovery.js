import getLedger from './get-ledger';
import blockchain from './blockchain';
import bitcoin from 'bitcoinjs-lib';

const walkDerivationPath = async ({account, isChange}) => {
  const addresses = [];
  // const gapLimit = 20; Should be 20 for prod, 1 for dev
  const gapLimit = 1;
  let consecutiveUnusedAddresses = 0;
  let addressIndex = 0;

  const ledger = await getLedger();

  // TODO: Don't request all pubkeys from Ledger, request xpub and derive keys on host
  // https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#serialization-format
  // https://github.com/LedgerHQ/ledgerjs/issues/114#issuecomment-372567048
  while (consecutiveUnusedAddresses < gapLimit) {
    const derivationPath = `44'/141'/${account}'/${isChange ? 1 : 0}/${addressIndex}`;
    const pubKey = await ledger.getWalletPublicKey(derivationPath);
    const address = await blockchain.getAddress(pubKey.bitcoinAddress);

    addresses.push({address: address.addrStr, account, isChange, addressIndex, derivationPath});

    if (address.totalReceived > 0 || address.unconfirmedBalance > 0) {
      consecutiveUnusedAddresses = 0;
    } else {
      consecutiveUnusedAddresses++;
    }

    addressIndex++;
  }

  await ledger.close();

  return addresses.slice(0, addresses.length - gapLimit);
};

const getAccountAddresses = async account => [
  ...await walkDerivationPath({account, isChange: false}),
  ...await walkDerivationPath({account, isChange: true})
];

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
