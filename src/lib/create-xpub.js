import bitcoin from 'bitcoinjs-lib';
import bs58check from 'bs58check';

const XPUB = bitcoin.networks.bitcoin.bip32.public;

const compressPublicKey = publicKey => bitcoin.ECPair
  .fromPublicKey(Buffer.from(publicKey, 'hex'), {compressed: true})
  .publicKey.toString('hex');

const getPublicKeyFingerprint = publicKey => {
  publicKey = Buffer.from(publicKey, 'hex');

  let publicKeyHash = bitcoin.crypto.hash160(publicKey);

  return (
    ((publicKeyHash[0] << 24) |
      (publicKeyHash[1] << 16) |
      (publicKeyHash[2] << 8) |
      publicKeyHash[3]) >>>
    0
  )
};

const createXpub = ({network = XPUB, depth, childnum, chainCode, publicKey}) => {
  publicKey = compressPublicKey(publicKey);
  const fingerprint = getPublicKeyFingerprint(publicKey);

  const xpub = Buffer.from([
    network.toString(16).padStart(8, '0'),
    depth.toString(16).padStart(2, '0'),
    fingerprint.toString(16).padStart(8, '0'),
    childnum.toString(16).padStart(8, '0'),
    chainCode,
    publicKey
  ].join(''), 'hex');

  return bs58check.encode(xpub);
};

export default createXpub;
