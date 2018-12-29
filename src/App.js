import React from 'react';
import {hot} from 'react-hot-loader';
import Header from './Header';
import Accounts from './Accounts';
import Footer from './Footer';
import './App.css';

class App extends React.Component {
  state = this.initialState;

  get initialState() {
    return {
      utxos: [],
      tiptime: null
    };
  }

  resetState = () => this.setState(this.initialState);

  handleRewardData = ({utxos, tiptime}) => {
    this.setState({utxos, tiptime});
  };

  render() {
    return (
      <div className="App">
        <Header
          {...this.state}
          handleRewardData={this.handleRewardData}
          resetState={this.resetState}
          />

        <section className="main">
          <Accounts {...this.state} />
        </section>

        <Footer />
      </div>
    );
  }
}

export default hot(module)(App);
