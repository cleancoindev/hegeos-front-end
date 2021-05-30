import React from 'react';

const pjson = require('../../package.json');

function Footer(props) {
    return (
      <footer className="footer-area">
        <div className="container">
          <p className="order-2 order-sm-1 pt-5">v{pjson.version} Copyright © HEGEOS</p>
        </div>
      </footer>
    );
}

export default Footer;