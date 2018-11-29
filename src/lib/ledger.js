import TransportU2F from '@ledgerhq/hw-transport-u2f';
import Btc from '@ledgerhq/hw-app-btc';

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

const getAddress = async derivationPath => {
  const ledger = await getDevice();
  const {bitcoinAddress} = await ledger.getWalletPublicKey(derivationPath);
  await ledger.close();

  return bitcoinAddress;
};

const ledger = {
  getDevice,
  isAvailable,
  getAddress
};

export default ledger;
