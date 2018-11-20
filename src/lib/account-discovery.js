import getLedger from './get-ledger';


const accountDiscovery = async () => {
  const insightUrl = 'https://kmdexplorer.io/insight-api-komodo';
  const addresses = [];
  const gapLimit = 20;
  let consecutiveUnusedAddresses = 0;
  let currentAddress = 0;

  const ledger = await getLedger();

  while (consecutiveUnusedAddresses < gapLimit) {
    const derivationPath = `44'/141'/0'/0/${currentAddress}`;
    const pubKey = await ledger.getWalletPublicKey(derivationPath);
    const address = await (await fetch(`${insightUrl}/addr/${pubKey.bitcoinAddress}/?noTxList=1`)).json();

    addresses.push({derivationPath, ...address});

    if(address.totalReceived > 0 || address.unconfirmedBalance > 0) {
      consecutiveUnusedAddresses = 0;
    } else {
      consecutiveUnusedAddresses++;
    }

    currentAddress++;
  }

  await ledger.close();

  return addresses.slice(0, addresses.length - gapLimit);
};

export default accountDiscovery;
