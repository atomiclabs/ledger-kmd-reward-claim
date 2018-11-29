import TransportU2F from '@ledgerhq/hw-transport-u2f';
import Btc from '@ledgerhq/hw-app-btc';
import buildOutputScript from 'build-output-script';

const getDevice = async () => {
  const transport = await TransportU2F.create();
  const ledger = new Btc(transport);

  ledger.close = () => transport.close();

  return ledger;
};

const isAvailable = async () => {
  const ledger = await getDevice();
  try {
    await ledger.getWalletPublicKey(`m/44'/0'/0'/0/0`);
    await ledger.close();
    return true;
  } catch (error) {
    return false;
  }
};

const getAddress = async (derivationPath, verify) => {
  const ledger = await getDevice();
  const {bitcoinAddress} = await ledger.getWalletPublicKey(derivationPath, verify);
  await ledger.close();

  return bitcoinAddress;
};

const createTransaction = async function(utxos, outputs) {
  const ledger = await getDevice();

  const inputs = await Promise.all(utxos.map(async utxo => {
    const tx = await ledger.splitTransaction(utxo.rawtx);
    return [tx, utxo.vout];
  }));
  const associatedKeysets = utxos.map(utxo => utxo.derivationPath);
  const outputScript = buildOutputScript(outputs);
  const unixtime = Math.floor(Date.now() / 1000);
  const lockTime = (unixtime - 777);

  const transaction = await ledger.createPaymentTransactionNew(
    inputs,
    associatedKeysets,
    undefined,
    outputScript,
    lockTime
  );

  await ledger.close();

  return transaction;
};

const ledger = {
  getDevice,
  isAvailable,
  getAddress,
  createTransaction
};

export default ledger;
