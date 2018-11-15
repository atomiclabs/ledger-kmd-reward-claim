import TransportU2F from '@ledgerhq/hw-transport-u2f';
import Btc from '@ledgerhq/hw-app-btc';

const getLedger = async () => {
  const transport = await TransportU2F.create();
  const ledger = new Btc(transport);
  ledger.close = () => transport.close();

  return ledger;
};

export default getLedger;
