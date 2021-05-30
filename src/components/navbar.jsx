import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import logo from '../images/logo.png';
import ConnectWallet from './connectWallet';

const pjson = require('../../package.json');

function navbar(props) {
    return (
        <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 ">
            <Link
                to={pjson.homepage+"/"}
                className="d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none"
            >
                <img src={logo} style={{ width: '160px' }} />
            </Link>

            <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                {props.wallet != false ? (
                    <>
                        <li>
                            <NavLink to={pjson.homepage+"/holders"} className="nav-link px-2">
                                Holders
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={pjson.homepage+"/liquidity"} className="nav-link px-2">
                                Writers
                            </NavLink>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <NavLink to={pjson.homepage+"/"} className="nav-link px-2">
                                Home
                            </NavLink>
                        </li>
                    </>
                )}
                {/*(<li>
                    <NavLink to={pjson.homepage+"/faq"} className="nav-link px-2">
                        How it works?
                    </NavLink>
                </li>)*/}
            </ul>

            <div className="col-md-3 text-end">
                <ConnectWallet
                    isLoggedIn={props.isLoggedIn}
                    onAttachWallet={props.onAttachWallet}
                    onDisconnectWallet={props.onDisconnectWallet}
                />
            </div>
        </header>
    );
}

export default navbar;
