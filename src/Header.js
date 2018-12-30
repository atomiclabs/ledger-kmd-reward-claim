import React from 'react';
import { ReactComponent as KmdIcon } from 'cryptocurrency-icons/svg/color/kmd.svg';
import './Header.scss';

const Header = ({children}) => (
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
            {children}
          </div>
        </div>
      </div>

    </div>
  </nav>
);

export default Header;
