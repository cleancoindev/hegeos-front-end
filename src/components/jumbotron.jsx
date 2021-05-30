import React from 'react';
import banner from '../images/banner-bg-2.png';
import ConnectWallet from './connectWallet';

export default function Jumbotron(props) {
    return (
        <div className="jumbotron">
            <div className="row">
                <div className="col text-center pt-5">
                    {' '}
                    <h2 className="display-5 text-center pt-5">
                        <strong>THE SIMPLEST OPTIONS TRADING EXPERIENCE</strong>
                    </h2>
                    <p className="lead text-center">
                        Trade non-custodial options for profits or to hedge your positions. Enjoy
                        fixed price and unlimited upside of the options contracts. No registration,
                        KYC or email required.
                    </p>
                    <hr className="my-4" />
                    <p>Get Started now and connect your wallet.</p>
                    <p className="lead">
                        <ConnectWallet
                            variant="danger"
                            isLoggedIn={props.isLoggedIn}
                            onAttachWallet={props.onAttachWallet}
                            onDisconnectWallet={props.onDisconnectWallet}
                        />
                    </p>
                </div>
                <div className="col">
                    <img src={banner} alt="" />
                </div>
            </div>
        </div>
    );
}
