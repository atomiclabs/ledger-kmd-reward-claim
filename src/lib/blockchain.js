const blockchain = {
  get: async endpoint => {
    const insightUrl = 'https://kmdexplorer.io/insight-api-komodo/';
    const response = await fetch(`${insightUrl}${endpoint}`);

    return await response.json();
  },
  getAddress: address => blockchain.get(`addr/${address}/?noTxList=1`),
  getUtxos: addresses => blockchain.get(`addrs/${addresses.join(',')}/utxo`),
  getTransaction: txid => blockchain.get(`tx/${txid}`),
  getRawTransaction: txid => blockchain.get(`rawtx/${txid}`),
  getBestBlockHash: () => blockchain.get('status?q=getBestBlockHash'),
  getBlock: blockHash => blockchain.get(`block/${blockHash}`),
  getTipTime: async () => {
    const {bestblockhash} = await blockchain.getBestBlockHash();
    const block = await blockchain.getBlock(bestblockhash);

    return block.time;
  }
};

export default blockchain;
