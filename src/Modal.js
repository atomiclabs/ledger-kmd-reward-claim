import React from 'react';

const Modal = ({children, title, show}) => (
  <div className={`modal ${show ? 'is-active' : ''}`}>
    <div className="modal-background"></div>
    <div className="modal-content">
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            {title}
          </p>
        </header>
        <div className="card-content">
          <div className="content">
            {children}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Modal;
