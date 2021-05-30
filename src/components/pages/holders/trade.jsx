import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Tabs, Tab } from 'react-bootstrap';

let hegeosRate = {
    buy: 0.000356600004999993,
    sell: 0.000320939995500005,
    buyUSD: 1.105,
    sellUSD: 0.995,
    buyDAI: 0.000357,
    sellDAI: 0.000321,
    max: 100000000,
    aquired: 0,
};

const dataBuy = {
    labels: ['1', '2', '3', '4', '5', '6'],
    datasets: [
        {
            label: 'Price Change',
            data: [0],
            fill: true,
            backgroundColor: '#199396',
            borderColor: '#199396',
        },
        {
            label: 'Current Price',
            data: [0],
            fill: true,
            backgroundColor: '#FFEE51',
            borderColor: '#FFEE51',
        },
        {
            label: 'Bonding Curve',
            data: [0],
            fill: true,
            backgroundColor: '#F26D26',
            borderColor: '#F26D26',
        },
    ],
};

const dataSell = {
    labels: ['1', '2', '3', '4', '5', '6'],
    datasets: [
        {
            label: 'Price Change',
            data: [0],
            fill: true,
            backgroundColor: '#199396',
            borderColor: '#199396',
        },
        {
            label: 'Current Price',
            data: [0],
            fill: true,
            backgroundColor: '#FFEE51',
            borderColor: '#FFEE51',
        },
        {
            label: 'Bonding Curve',
            data: [0],
            fill: true,
            backgroundColor: '#F26D26',
            borderColor: '#F26D26',
        },
    ],
};

const options = {
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                },
            },
        ],
    },
};
function Trade(props) {
    const [action, setAction] = useState('buy');
    const [buyPrice, setBuyPrice] = useState(1);
    const [sellPrice, setSellPrice] = useState(1);

    const handleBuySubmit = (e) => {
        alert('BUY HERE');
    };

    const handleSellSubmit = (e) => {
        alert('SELL HERE');
    };

    const handleChangeBuy = ({ currentTarget: input }) => {
        setBuyPrice(input.value);
    };
    const handleChangeSell = ({ currentTarget: input }) => {
        setSellPrice(input.value);
    };

    return (
        <>
            <div className="row">
                <h2>BONDING CURVE CONTRACT: BUY OR SELL {process.env.REACT_APP_HEGEOS_SYMBOL} TOKENS.</h2>
                <p>
                    The {process.env.REACT_APP_HEGEOS_SYMBOL} token price increases as the supply of the token increases. When a new buyer has acquired
                    the {process.env.REACT_APP_HEGEOS_SYMBOL} token, each subsequent buyer will have to pay a slightly higher price for each token. As
                    more people will discover {process.env.REACT_APP_HEGEOS_SYMBOL} protocol and buying continues, the value of each token gradually
                    increases along the bonding curve. DAI-{process.env.REACT_APP_HEGEOS_SYMBOL} swap fee: 0%. {process.env.REACT_APP_HEGEOS_SYMBOL}-DAI swap fee: 10%.
                </p>
            </div>

            <Tabs id="trading" activeKey={action} onSelect={(k) => setAction(k)}>
                <Tab eventKey="buy" title="Buy">
                    <div className="row pt-5">
                        <div className="col-sm-4">
                            <label className="form-label">You are buying this amount of HEGIC:</label>
                            <br />
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    name="buyPrice"
                                    id="buyPrice"
                                    className="form-control"
                                    placeholder="1"
                                    aria-label={process.env.REACT_APP_HEGEOS_SYMBOL}
                                    value={buyPrice}
                                    onChange={handleChangeBuy}
                                />
                                <span className="input-group-text" id="basic-addon2">
                                    {process.env.REACT_APP_HEGEOS_SYMBOL}
                                </span>
                            </div>
                        </div>
                        <div className="col-sm-4 text-center with-arrow">
                            <div className="provide-liquidity__arrow"></div>
                        </div>
                        <div className="col-sm-4">
                            <label className="form-label">You are sending this amount of DAI:</label>
                            <br />
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    name="buyAmount"
                                    id="buyAmount"
                                    className="form-control"
                                    placeholder="1"
                                    aria-label="USD"
                                    readonly="true"
                                    value={buyPrice * hegeosRate.buy}
                                />
                                <span className="input-group-text" id="basic-addon2">
                                    DAI
                                </span>
                            </div>
                        </div>

                        <div className="col-md-8">
                            <Line data={dataBuy} options={options} />
                        </div>
                        <div className="col-md-4">
                            <div className="callout callout-strike">
                                Your Buy Price
                                <h3>{parseFloat(hegeosRate.buy).toFixed(6)} DAI</h3>
                                <small>≈ ${hegeosRate.buyUSD} USD</small>
                            </div>
                            <div className="callout callout-even">
                                Acquired on the Bonding Curve
                                <h3>{hegeosRate.aquired} {process.env.REACT_APP_HEGEOS_SYMBOL}</h3>
                                <small>{hegeosRate.aquired * hegeosRate.buyDAI} DAI</small>
                            </div>
                            <div className="callout callout-total">
                                Available on the Bonding Curve
                                <h3>{hegeosRate.max} {process.env.REACT_APP_HEGEOS_SYMBOL}</h3>
                                <small>{hegeosRate.max * hegeosRate.buy}</small>
                            </div>
                        </div>

                        <div className="col-md-12">
                            <a className="btn btn-primary col-md-12" onClick={() => handleBuySubmit()}>
                                BUY
                            </a>
                            <p className="small pt-4">
                                Each time {process.env.REACT_APP_HEGEOS_SYMBOL} tokens are acquired using the bonding curve contract, the EOS-{process.env.REACT_APP_HEGEOS_SYMBOL}
                                swap transaction increases the price of {process.env.REACT_APP_HEGEOS_SYMBOL} token for a fixed value of 0.00000000001
                                DAI. The contract itself is used as a price oracle. If a token holder wants to swap
                                {process.env.REACT_APP_HEGEOS_SYMBOL} tokens for ETH using the bonding curve contract, she will pay a 10% swap fee on
                                this transaction.
                            </p>
                        </div>
                        <hr />
                    </div>
                </Tab>
                <Tab eventKey="sell" title="Sell">
                    <div className="row  pt-5">
                        <div className="col-sm-4">
                            <label className="form-label">You are selling this amount of HEGIC:</label>
                            <br />
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    name="sellPrice"
                                    id="sellPrice"
                                    className="form-control"
                                    placeholder="1"
                                    aria-label={process.env.REACT_APP_HEGEOS_SYMBOL}
                                    value={sellPrice}
                                    onChange={handleChangeSell}
                                />
                                <span className="input-group-text" id="basic-addon2">
                                    {process.env.REACT_APP_HEGEOS_SYMBOL}
                                </span>
                            </div>
                        </div>
                        <div className="col-sm-4 text-center with-arrow">
                            <div className="provide-liquidity__arrow"></div>
                        </div>
                        <div className="col-sm-4">
                            <label className="form-label">You are sending this amount of DAI:</label>
                            <br />
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    name="sellAmount"
                                    id="sellAmount"
                                    className="form-control"
                                    placeholder="1"
                                    aria-label="USD"
                                    readonly="true"
                                    value={sellPrice * hegeosRate.sell}
                                />
                                <span className="input-group-text" id="basic-addon2">
                                    DAI
                                </span>
                            </div>
                        </div>

                        <div className="col-md-8">
                            <Line data={dataSell} options={options} />
                        </div>
                        <div className="col-md-4">
                            <div className="callout callout-strike">
                                Your sell Price
                                <h3>{parseFloat(hegeosRate.sell).toFixed(6)} DAI</h3>
                                <small>≈ ${hegeosRate.sellUSD} USD</small>
                            </div>
                            <div className="callout callout-even">
                                Acquired on the Bonding Curve
                                <h3>{hegeosRate.aquired} {process.env.REACT_APP_HEGEOS_SYMBOL}</h3>
                                <small>{hegeosRate.aquired * hegeosRate.sellDAI} DAI</small>
                            </div>
                            <div className="callout callout-total">
                                Available on the Bonding Curve
                                <h3>{hegeosRate.max} {process.env.REACT_APP_HEGEOS_SYMBOL}</h3>
                                <small>{hegeosRate.max * hegeosRate.sell}</small>
                            </div>
                        </div>

                        <div className="col-md-12">
                            <a className="btn btn-primary col-md-12" onClick={() => handleSellSubmit()}>
                                SELL
                            </a>
                            <p className="small pt-4">
                                Each time {process.env.REACT_APP_HEGEOS_SYMBOL} tokens are acquired using the bonding curve contract, the EOS-{process.env.REACT_APP_HEGEOS_SYMBOL}
                                swap transaction increases the price of {process.env.REACT_APP_HEGEOS_SYMBOL} token for a fixed value of 0.00000000001
                                DAI. The contract itself is used as a price oracle. If a token holder wants to swap
                                {process.env.REACT_APP_HEGEOS_SYMBOL} tokens for ETH using the bonding curve contract, she will pay a 10% swap fee on
                                this transaction.
                            </p>
                        </div>
                        <hr />
                    </div>
                </Tab>
            </Tabs>
        </>
    );
}

export default Trade;
