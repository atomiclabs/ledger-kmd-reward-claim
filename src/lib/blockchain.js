const get = async endpoint => {
  const insightUrl = 'https://kmdexplorer.io/insight-api-komodo/';
  const response = await fetch(`${insightUrl}${endpoint}`);

  return await response.json();
};

const getAddress = address => get(`addr/${address}/?noTxList=1`);

const getUtxos = addresses => get(`addrs/${addresses.join(',')}/utxo`);

const getTransaction = txid => get(`tx/${txid}`);

const getRawTransaction = txid => get(`rawtx/${txid}`);

const getBestBlockHash = () => get('status?q=getBestBlockHash');

const getBlock = blockHash => get(`block/${blockHash}`);

const getTipTime = async () => {
  const {bestblockhash} = await getBestBlockHash();
  const block = await getBlock(bestblockhash);

  return block.time;
}

const blockchain = {
  get,
  getAddress,
  getUtxos,
  getTransaction,
  getRawTransaction,
  getBestBlockHash,
  getBlock,
  getTipTime
};

export default blockchain;
