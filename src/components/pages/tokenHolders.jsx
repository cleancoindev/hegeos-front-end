import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Analytics from './holders/analytics';
import Earn from './holders/earn';
import Mining from './holders/mining';
import Trade from './holders/trade';
import Utilization from './holders/utilization';

const pjson = require('../../../package.json');

const tokenData = {
    currency: 'DAI',
    hegeosOwn: 0,
    daiBalance: 0,
    totalProvided: 281902,
};

function TokenHolders(props) {
    const [screen, setScreen] = useState('mining');

    const activeClass = 'p-3 rounded-2 bg-primary active';
    const nonActiveClass = 'p-3 rounded-2 bg-primary';

    const handleScreen = (event, title) => {
        console.log(event, title);
        setScreen(title);
    };
    return (
        <>
            <div className="row">
                <div className="col-md-7 pt-md-5">
                    <h2>DISCOVER FOUR TYPES OF JOBS THAT HEGIC CAN DO FOR YOU</h2>
                    <p>I. Win big with call options: fixed price and unlimited upside.</p>
                    <p>II. Protect your holdings with put options or earn speculating.</p>{' '}
                    <p>III. Earn yield on {tokenData.currency} in a set-and-forget manner.</p>
                    <p>IV. Participate in staking and earn rewards in WBTC or ETH.</p>
                    <Link to={pjson.homepage+"/faq"}>How Hegios.io works?</Link>
                </div>
                <div className="col-md-5">
                    <img src={pjson.homepage+"/images/benefits-6.png"} className="w-100" />
                </div>
            </div>
            <hr />
            <div className="row text-center">
                <div className="col">
                    <div className="p-3 rounded-2 bg-primary">
                        <h3>0</h3> Your transferrable {tokenData.currency}
                    </div>
                </div>
                <div className="col">
                    <div className="p-3 rounded-2 bg-primary">
                        <h3>0</h3> Your Staked Hegic
                    </div>
                </div>
                <div className="col">
                    <div className="p-3 rounded-2 bg-primary">
                        <h3>0</h3> Current {tokenData.currency} Price
                    </div>
                </div>
                <div className="col">
                    <div className="p-3 rounded-2 bg-primary">
                        <h3>0</h3> Total USD Value of Holdings
                    </div>
                </div>
            </div>
            <div className="row pt-5 text-center interface">
                <h2>Choose the Interface that you want to interact with</h2>
                <hr />
                <div className="col">
                    <div
                        className={screen === 'mining' ? activeClass : nonActiveClass}
                        onClick={(e) => handleScreen(e, 'mining')}
                    >
                        LIQUIDITY
                        <br />
                        MINING
                        <br />
                        REWARDS
                    </div>
                </div>
                <div className="col">
                    <div
                        className={screen === 'utilization' ? activeClass : nonActiveClass}
                        onClick={(e) => handleScreen(e, 'utilization')}
                    >
                        LIQUIDITY
                        <br />
                        UTILIZATION
                        <br />
                        REWARDS
                    </div>
                </div>
                <div className="col">
                    <div
                        className={screen === 'trade' ? activeClass : nonActiveClass}
                        onClick={(e) => handleScreen(e, 'trade')}
                    >
                        BONDING CURVE :<br />
                        BUY OR SELL
                        <br />
                        {tokenData.currency}
                    </div>
                </div>
                <div className="col">
                    <div
                        className={screen === 'analytics' ? activeClass : nonActiveClass}
                        onClick={(e) => handleScreen(e, 'analytics')}
                    >
                        HEGIC <br />
                        TOKEN <br />
                        ANALYTICS
                    </div>
                </div>
            </div>

            <div className="row pt-5 text-center">
                <hr />
                {screen === 'mining' && (
                    <Mining
                        totalProvided={tokenData.totalProvided}
                        hegeosOwn={tokenData.hegeosOwn}
                        daiBalance={tokenData.daiBalance}
                        currency={tokenData.currency}
                    />
                )}
                {screen === 'utilization' && <Utilization />}
                {screen === 'trade' && <Trade />}
                {screen === 'analytics' && <Analytics />}
            </div>
        </>
    );
}

export default TokenHolders;
