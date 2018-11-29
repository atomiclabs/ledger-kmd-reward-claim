import TransportU2F from '@ledgerhq/hw-transport-u2f';
import Btc from '@ledgerhq/hw-app-btc';

const getLedger = async () => {
  const transport = await TransportU2F.create();
  const ledger = new Btc(transport);

  ledger.close = () => transport.close();

  ledger.getAddress = async derivationPath => {
    const {bitcoinAddress} = await ledger.getWalletPublicKey(derivationPath);

    return bitcoinAddress;
  }

  ledger.isAvailable = async () => {
    try {
      await ledger.getWalletPublicKey(`m/44'/0'/0'/0/0`);

      return true;
    } catch (e) {
      return false;
    }
  }

  return ledger;
};

export default getLedger;
