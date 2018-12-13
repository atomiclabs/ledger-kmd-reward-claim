import React from 'react';
import {hot} from 'react-hot-loader';
import ledger from './lib/ledger';
import accountDiscovery from './lib/account-discovery';
import blockchain from './lib/blockchain';
import Accounts from './Accounts';
import './App.css';

class App extends React.Component {
  state = this.initialState;

  get initialState() {
    return {
      status: null,
      utxos: [],
      tiptime: null,
      isCheckingRewards: false
    };
  }

  scanAddresses = async () => {
    this.setState({
      ...this.initialState,
      isCheckingRewards: true,
      status: 'Checking Ledger is available...'
    });

    const utxos = [{"id":"700b20ec365bd0a7a1c45557716b80b015db2d1fc19d40826dc5902a969810f9:0","address":"RMqevVxyUkgJdSqYEKj5CK4XcX5UvqFsyj","account":0,"isChange":false,"addressIndex":0,"derivationPath":"44'/141'/0'/0/0","txid":"700b20ec365bd0a7a1c45557716b80b015db2d1fc19d40826dc5902a969810f9","vout":0,"scriptPubKey":"76a91489c53a986872ed85152facda1b3f306061c8234288ac","amount":13.07732437,"satoshis":1307732437,"height":1116402,"confirmations":21443,"locktime":1543375591,"rawtx":"0100000001a5885a67aa33a0e40cfb8f4783191fd77e8e1c7c7288cfc02e240569a04b6d5c000000006a47304402201c26a208b48fb90e0999790528f2f26cd6c427e5e013d6cda5f0fc7b5775727b02205347d14243865cc5bac5afae976db9f44aa43cb101d1d9622073e9ac40e4b48e012102e4f4b2a6fc1b0b04ae652a961658802c94ffdbe5203ff45466b583c2ac6ec4ebffffffff01d569f24d000000001976a91489c53a986872ed85152facda1b3f306061c8234288ace70afe5b"},{"id":"86a51b2a19836c8e9201787a15afcc2afeacefa96f86e13596c1b5d9f4862381:1","address":"RBw5k9jfEFBzxpc5qG5pZJZn2L2JUdDXEj","account":0,"isChange":true,"addressIndex":1,"derivationPath":"44'/141'/0'/1/1","txid":"86a51b2a19836c8e9201787a15afcc2afeacefa96f86e13596c1b5d9f4862381","vout":1,"scriptPubKey":"76a9141d1ac557628b2faaaa961058ba7a5dacb652f55f88ac","amount":4.9,"satoshis":490000000,"height":1104921,"confirmations":32924,"locktime":0,"rawtx":"0100000002f7f2e88bc56d8c207a68771b7e7553b0e5fc164a4358769cd606ff6f4599e362010000006b48304502210080043e370ad8cae1d5a644010cdefa8cb2a5f4c70a176d7121ff6bc7a3b5267202203cbcf00d0dfe0b50a3b4004ea78868775efae2657060851d9991e1517661b756012103f86772a100c46e1edb82ee1e9d5422cb905590dfc7666a9f6c16b35a86e839aeffffff003cff05bd35efd8bb401aabb679a2a07403bd6be7fe5596a1567c8f88562ef691000000006b483045022100ad16c0cf9d82c5b1f87f1b033377334fe247b853816b303e9c8d2c4e2c8aedf402201d2641bbe20a88843c07525ff1b837bf39df56a477b04545c757a07bb55a5568012102e4f4b2a6fc1b0b04ae652a961658802c94ffdbe5203ff45466b583c2ac6ec4ebffffff00028060333c000000001976a914941caf0720f9a6fc668b07a1c485565996086a9588ac80ce341d000000001976a9141d1ac557628b2faaaa961058ba7a5dacb652f55f88ac00000000"},{"id":"79d06423ceb0e0263b82e5101fae893d1888aefd2ad754632198da5af7ca2fd6:0","address":"RVyUhCY6ynV6ETkJpV5yE3YJ79r9171LAr","account":0,"isChange":false,"addressIndex":1,"derivationPath":"44'/141'/0'/0/1","txid":"79d06423ceb0e0263b82e5101fae893d1888aefd2ad754632198da5af7ca2fd6","vout":0,"scriptPubKey":"76a914e301061ad98652ff6be6d1c63bd28e388bd7566988ac","amount":11,"satoshis":1100000000,"height":1077977,"confirmations":59868,"locktime":1541056904,"rawtx":"0100000001f7f2e88bc56d8c207a68771b7e7553b0e5fc164a4358769cd606ff6f4599e362000000006b483045022100db3de5b7942701ac3cab907629d4185a3625c7ee57b13dd56030dfdcadd98e1802205e7f28c15a8cd48ad5c87de846a61480bfded5704ee8bcf5dbb64a857138dddc012103e046283b093efc6d895ab82f53a56a39e4ab27daa423c6fed7f6a0f0ee0c5afaffffffff0100ab9041000000001976a914e301061ad98652ff6be6d1c63bd28e388bd7566988ac88a9da5b"},{"id":"c71feb8dc57a35dbb824a8c5fe13fccbdbc7c7afee52f12ec202ee9766445663:0","address":"RMqevVxyUkgJdSqYEKj5CK4XcX5UvqFsyj","account":0,"isChange":false,"addressIndex":0,"derivationPath":"44'/141'/0'/0/0","txid":"c71feb8dc57a35dbb824a8c5fe13fccbdbc7c7afee52f12ec202ee9766445663","vout":0,"scriptPubKey":"76a91489c53a986872ed85152facda1b3f306061c8234288ac","amount":12.00000704,"satoshis":1200000704,"height":1076976,"confirmations":60869,"locktime":1540997155,"rawtx":"01000000016f84cb1fd9ed9a2e60fb8413353427b963219013b260a85dc817b8d7f93e60d3000000006b483045022100cbec2ee93d31513d2c37b0ae02278ae6a3fa9b79f9bf52331117610b9cfb17a402206291b3c46685ca388ebfc26adbcc9c5809f6613a031df6c6a886ce81f7d0b698012102e4f4b2a6fc1b0b04ae652a961658802c94ffdbe5203ff45466b583c2ac6ec4ebffffffff01c08e8647000000001976a91489c53a986872ed85152facda1b3f306061c8234288ac23c0d95b"},{"id":"5c42f05ea98370becbdb0622eaadd79c8ea5c3cb26e1904f4d5cc0299b934508:0","address":"RGV1b1uMDFuj5cGSww1AzUiuXWKg522mr1","account":1,"isChange":false,"addressIndex":3,"derivationPath":"44'/141'/1'/0/3","txid":"5c42f05ea98370becbdb0622eaadd79c8ea5c3cb26e1904f4d5cc0299b934508","vout":0,"scriptPubKey":"76a9144f051d40cd4a97ccca3aae035b085cc5f508a1d488ac","amount":10.10461053,"satoshis":1010461053,"height":1135186,"confirmations":2659,"locktime":1544517670,"rawtx":"010000000146ced6d7073e8ddc8d8a5546bcc3afcdb3e94ab4d7481a5c4ca6d3a1edeb5014000000006b483045022100bc1597a74586e0f942ea155e1dffb2537edcb0289a156b8c9eaf4be00a25bc3702203139b9293fab54bf5241886e5476ef6da86d3acaaeb5175e2db51f8c2d6ed426012103ab8ec2c5a57bb59bf52e12c71a7b20af296c92f3700419fe6d65db83a093ca51ffffffff027d693a3c000000001976a9144f051d40cd4a97ccca3aae035b085cc5f508a1d488ac03670000000000001976a9147a0080f135c6cc311b3756cf3b7f070b65b5b41e88ac26780f5c"},{"id":"230832048a51c216ef02f69af30c8bd7905c1ca119dc1e4ac11fbc7472205aff:0","address":"RLzXPgNTePpidmmMJGgMAbKuLYnpLD3suo","account":2,"isChange":false,"addressIndex":1,"derivationPath":"44'/141'/2'/0/1","txid":"230832048a51c216ef02f69af30c8bd7905c1ca119dc1e4ac11fbc7472205aff","vout":0,"scriptPubKey":"76a9137a8f53d39321bfb3e6d6249093be8f5cfc40c688ac","amount":0.00006371,"satoshis":6371,"confirmations":0,"ts":1544680061,"locktime":1544679267,"rawtx":"01000000010845939b29c05c4d4f90e126cbc3a58e9cd7adea2206dbcbbe7083a95ef0425c010000006a473044022065001729b8623d9009b562c522a3e291a0820db251300b80e5a975f899ca5f1a02202757b65d37cf8c510e43759b488c3bb5d00b8c64d10592b4ba319ed76f9957ae01210399310a2057182f934c6b8d41e46fe52392c953ce03763c8b8b699f10ee5a5d2affffffff01e3180000000000001976a914807a8f53d39321bfb3e6d6249093be8f5cfc40c688ac63ef115c"}]
    const tiptime = 1544680060;

    this.setState({
      isCheckingRewards: false,
      status: 'Scan complete!',
      utxos,
      tiptime
    });

    return;

    const ledgerIsAvailable = await ledger.isAvailable();
    if (!ledgerIsAvailable) {
      this.setState({
        isCheckingRewards: false,
        status: 'Error: Ledger device is unavailable!'
      });
      return;
    }

    this.setState({status: 'Scanning blockchain for funds...'});
    try {
      const utxos = await accountDiscovery();
      const tiptime = await blockchain.getTipTime();

      this.setState({
        isCheckingRewards: false,
        status: 'Scan complete!',
        utxos,
        tiptime
      });
    } catch (error) {
      this.setState({
        isCheckingRewards: false,
        status: `Error: ${error.message}`
      });
    }
  };

  render() {
    const {isCheckingRewards, utxos, tiptime, status} = this.state;

    return (
      <div className="App">
        <section className="hero">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                Connect your Ledger and open the Komodo app on your device.
              </h1>
              <h2 className="subtitle">
                <div className="wrapper">
                  <button className={`button is-primary is-large ${isCheckingRewards && 'is-loading'}`} onClick={this.scanAddresses}>
                    Check Rewards
                  </button>
                  <span className="status">{status && status}</span>
                </div>
              </h2>
            </div>
          </div>
        </section>
        <Accounts
          utxos={utxos}
          tiptime={tiptime}
          />
      </div>
    );
  }
}

export default hot(module)(App);
