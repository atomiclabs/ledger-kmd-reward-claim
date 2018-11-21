const blockchain = {
  get: async endpoint => {
    const insightUrl = 'https://kmdexplorer.io/insight-api-komodo/';
    const response = await fetch(`${insightUrl}${endpoint}`);

    return await response.json();
  },
  getAddress: address => blockchain.get(`addr/${address}/?noTxList=1`),
  getUtxos: addresses => blockchain.get(`addrs/${addresses.join(',')}/utxo`),
  getTransaction: txid => blockchain.get(`tx/${txid}`)
};

export default blockchain;
