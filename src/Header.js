import React from 'react';
import { ReactComponent as KmdIcon } from 'cryptocurrency-icons/svg/color/kmd.svg';
import './Header.css';

const Header = ({checkRewards, resetState, isCheckingRewards}) => (
  <nav className="Header navbar is-fixed-top" role="navigation" aria-label="main navigation">
    <div className="container">
      <div className="navbar-brand">
      <div className="navbar-item">
        <KmdIcon className="KmdIcon"/>
      </div>
      <h1 className="navbar-item">
        <strong>Ledger KMD Reward Claim</strong>
      </h1>
      </div>

      <div className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <button className={`button is-primary ${isCheckingRewards && 'is-loading'}`} onClick={checkRewards}>
                <strong>Check Rewards</strong>
              </button>
              <button className="button is-light" onClick={resetState}>
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

export default Header;
