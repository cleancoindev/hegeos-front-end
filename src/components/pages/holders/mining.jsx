import React from 'react';

function Mining(props) {
    return (
        <div>
            <h2>LOCK WRITE (LP) TOKENS AND EARN {process.env.REACT_APP_HEGEOS_SYMBOL} REWARDS</h2>
            <p>
                Liquidity providers can claim rewards in {process.env.REACT_APP_HEGEOS_SYMBOL}. After providing EOS or DAI to one of the pools you will
                receive tokens. You will need to lock these write tokens to start receiving rewards in {process.env.REACT_APP_HEGEOS_SYMBOL} tokens.
                After locking them your share in rewards will be increasing each block. You will need to manually claim
                {process.env.REACT_APP_HEGEOS_SYMBOL}.
            </p>
            <div className="row">
                <div className="col-4">
                    <div className="sqborder">
                        Total Provided
                        <h3>
                            {props.totalProvided}
                            <br />
                            write{props.currency}
                        </h3>
                    </div>
                </div>
                <div className="col-8">
                    <div className="callout col-md-12 callout-strike ">
                        <h2>W{props.currency} POOL LIQUIDITY MINING REWARDS</h2>
                        <h3>{props.hegeosOwn} {process.env.REACT_APP_HEGEOS_SYMBOL}</h3>
                        <a className="btn btn-md btn-primary  w-75">CLAIM REWARDS</a>
                        <br />
                        <small>
                            Click the Claim Rewards button and confirm the transaction for <br />
                            receiving your share of staking rewards to your address.
                        </small>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="callout callout-total">
                        Your Address Balance
                        <h3>{props.daiBalance} writeDAI</h3>
                        <a className="btn btn-warning  w-75">Lock Tokens</a>
                        <br />
                        <small>Lock writeDAI to start recieving rewards in {process.env.REACT_APP_HEGEOS_SYMBOL}</small>
                    </div>
                </div>
                <div className="col">
                    <div className="callout callout-even">
                        Your Address Balance
                        <h3>{props.daiBalance} writeDAI</h3>
                        <a className="btn btn-danger w-75">Unlock Tokens</a>
                        <br />
                        <small>Lock writeDAI to start recieving rewards in {process.env.REACT_APP_HEGEOS_SYMBOL}</small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Mining;
