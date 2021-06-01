import React, {useState} from 'react';
import {Route, Switch } from 'react-router-dom'

import './App.scss';
import Wallet from './api/Wallets';

import Footer from './components/footer';
import Navbar from './components/navbar';
import Home from './components/pages/home';
import Backgrounds from './components/backgrounds';
import Holders from './components/pages/holders';
import Liquidity from './components/pages/liquidity';
import FaqPage from './components/faqPage';
import TokenHolders from './components/pages/tokenHolders';

import { Anchor } from 'ual-anchor';
import { UALProvider, withUAL } from 'ual-reactjs-renderer';

import PropTypes from 'prop-types';

import EosService from './eosio/EosService';

const pjson = require('../package.json');

class HegeosApp extends React.Component {
  static propTypes = {
    ual: PropTypes.shape({
      activeUser: PropTypes.object,
      activeAuthenticator: PropTypes.object,
      logout: PropTypes.func,
      showModal: PropTypes.func,
    }).isRequired,
  }

  constructor (props) {
    super(props);
    this.state = {
      wallet: false
    }
  }

  isLoggedIn = () => {
    //return this.wallet !== false;
    const r = EosService.isLoggedIn(this.props);
    console.log('isLoggedIn:', r);
    return r;
  }

  attachWallet = (/* wallet */) => {
    this.props.ual.showModal();
    //Wallet.attachWallet(wallet.walletCode);
    //this.setState({
    //  wallet: wallet.walletName
    //});
  };

  disconnectWallet = (wallet) => {
    const { ual: { activeUser } } = this.props;
    if (activeUser) {
      this.props.ual.logout();
    }    
    this.setState({
      wallet: false
    });
  };

  render() {
    return (
      <React.Fragment>
        <main className="container">
          <Navbar
            isLoggedIn={this.isLoggedIn}
            onAttachWallet={this.attachWallet}
            onDisconnectWallet={this.disconnectWallet}
          />
          <div className="content">
            <Switch>
              <Route path={pjson.homepage+"/holders"}>
                <Holders
                  isLoggedIn={this.isLoggedIn}
                  onAttachWallet={this.attachWallet}
                  onDisconnectWallet={this.disconnectWallet}
                />
              </Route>
              <Route path={pjson.homepage+"/liquidity"}>
                <Liquidity 
                  isLoggedIn={this.isLoggedIn}
                />
              </Route>
              <Route path={pjson.homepage+"/faq"}>
                <FaqPage />
              </Route>{' '}
              <Route exact path={pjson.homepage+"/"}>
                {this.isLoggedIn() && (
                  <Holders
                    isLoggedIn={this.isLoggedIn}
                    onAttachWallet={this.attachWallet}
                    onDisconnectWallet={this.disconnectWallet}
                  />
                )}
                {!this.isLoggedIn() && (
                  <Home
                    isLoggedIn={this.isLoggedIn}
                    onAttachWallet={this.attachWallet}
                    onDisconnectWallet={this.disconnectWallet}
                  />
                )}
              </Route>
            </Switch>
          </div>
        </main>
        <Backgrounds />
        <Footer />
      </React.Fragment>
    );
  }
}

const chains = [{
  chainId: process.env.REACT_APP_CHAIN_ID,
  name: process.env.REACT_APP_CHAIN_NAME,
  rpcEndpoints: [{
      protocol: 'https',
      host: (new URL(process.env.REACT_APP_NODE_ENDPOINT)).host,
      port: 443,
  }]
}]

class UALWrapper extends React.Component {
    constructor (props) {
        super(props);
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const chainId = params.get('chain');
        this.state = {
            chainId: chainId || chains[0].chainId
        }
    }

    setChain = (event) => {
        this.setState({ chainId: event.target.value });
    }

    render() {
        const { chainId } = this.state;
        const { available } = this.props;
        const [ chain ] = available.filter((c) => c.chainId === chainId);
        if (!chain) {
            return (
                <div>Invalid Chain ID</div>
            );
        }
        const anchor = new Anchor([chain], {
            // Required: The app name, required by anchor-link. Short string identifying the app
            appName: 'hegeos',
            // Optional: a @greymass/eosio APIClient from eosjs for both your use and to use internally in UAL
            // client = new APIClient({ provider }),
            // Optional: a JsonRpc instance from eosjs for your use
            // rpc: new JsonRpc(),
            // Optional: The callback service URL to use, defaults to https://cb.anchor.link
            // service: 'https://cb.anchor.link',
            // Optional: A flag to disable the Greymass Fuel integration, defaults to false (enabled)
            // disableGreymassFuel: false,
            // Optional: An account name on a Fuel enabled network to specify as the referrer for transactions
            // fuelReferrer: 'teamgreymass',
            // Optional: A flag to enable the Anchor Link UI request status, defaults to true (enabled)
            // requestStatus: true,  
            // Optional: Whether or not to verify the signatures during user login, defaults to false (disabled)
            // verifyProofs: false,
        });
        //const ledger = new Ledger([chain]);
        //const scatter = new Scatter([chain], { appName: 'hegeos' });
        return (
            <div>
                <UALProvider
                    appName='Hegeos'
                    authenticators={[
                      anchor, 
                      //ledger, 
                      //scatter
                    ]}
                    chains={[chain]}
                    key={chain.chainId}
                >
                    <AppConsumer />
                </UALProvider>
            </div>
        );
    }
}

const AppConsumer = withUAL(HegeosApp);

const App = () => (
  <UALWrapper available={chains} />
)

export default App;
