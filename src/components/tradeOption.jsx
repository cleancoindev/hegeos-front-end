import React, { Component } from 'react';
import Joi from 'joi-browser';

import Crypto from '../api/Crypto';
import Contracts from '../api/Contracts';
import TradingOption from '../api/TradingOption';

import FaqPage from './faqPage';
import Features from './features';
import HoldingPeriodChart from './holdingPeriodChart';
import HoldingPeriodMessage from './holdingPeriodMessage';
import Jumbotron from './jumbotron';
import LiquidityPool from './liquidityPool';
import ConnectWallet from './connectWallet';
import OptionContracts from './optionContracts';
import CurrencyBalance from './currencyBalance';

import EosService from '../eosio/EosService';

export default class TradeOption extends Component {
    state = {
        // holds the form fields
        tradeOption: {
            option: 'CALL',
            optionSize: '',
            strikePrice: '',
            holdingPeriod: 1,
            currency: 'USDC',
        },
        // get the crypto current rates
        cryptoCurrency: Crypto.getCryptoCurrency('USDC'),
        impliedVolRate: 45.5,
        // form error messages goes here
        errors: {},
        // hold the component state to reanimate in react-spring
        components: {
            holdingPeriodMessage: true,
            holdingPeriodChart: true,
        },
        graphData: {
            optionType: 'CALL',
            currentPrice: 0,
            strikePrice: 0,
            breakEvenPrice: 0,
            totalCost: 0,
            previousPos: 0,
            newPos: 0,
        },
        maxOptionSize: 0
    };

    schema = () => {
        return {
            currency: Joi.string().required().label('Currency'),
            option: Joi.string().required().label('Trade Option'),
            optionSize: Joi.number().min(parseFloat(process.env.REACT_APP_MIN_OPTION_SIZE || 0)).max(this.state.maxOptionSize).required().label('Option Size'),
            strikePrice: Joi.number().required().label('Strike Price'),
            holdingPeriod: Joi.required().label('Holding Period'),
        }
    }

    updateTick = () => {
        this.setState({
            refreshOptionList: !this.state.refreshOptionList,
            refreshBalance: !this.state.refreshBalance,
        });
        this.getMarketPrice();
        //this.getCurrencyBalance();
        this.getImpliedVolRate();
    }

    componentDidMount() {

        let currentState = { ...this.state };
        currentState.errors = {};
        this.updateState(this.state);

        this.getMarketPrice();
        //this.getCurrencyBalance();
        this.getImpliedVolRate();

        this.updateInterval = setInterval(this.updateTick, 5000); //update every 5 seconds
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval);   
    }

     getMarketPrice() {
        const currentCurrency = this.state.tradeOption.currency; 
        if (currentCurrency === 'USDC' || currentCurrency === 'DAI') {
            if (process.env.REACT_APP_TEST_MARKET_PRICE) {
                //const usdPrice = parseFloat(process.env.REACT_APP_TEST_MARKET_PRICE);
                //Crypto.setMarketPrice('USDC', usdPrice);
                //Crypto.setMarketPrice('DAI', usdPrice);
                let currentState = { ...this.state };
                currentState.cryptoCurrency = Crypto.getCryptoCurrency(currentCurrency);
                this.updateState(currentState);
                return;
            }
            EosService.usdPrice()
                .then(price => {
                    //console.log('price:', price);
                    if (currentCurrency === 'USDC' && price.usdc) {
                        Crypto.setMarketPrice('USDC', price.usdc);
                    }
                    if (currentCurrency === 'DAI' && price.dai) {
                        Crypto.setMarketPrice('DAI', price.dai);
                    }
                    let currentState = { ...this.state };
                    currentState.cryptoCurrency = Crypto.getCryptoCurrency(currentCurrency);
                    this.updateState(currentState);
                },
                this.handleError);
        }
    }

    getImpliedVolRate() {
        EosService.optionConfig()
            .then(result => {
                const impliedVolRate = result.rows && result.rows[0] && result.rows[0].impliedvolrate;
                if (impliedVolRate) {
                    let currentState = { ...this.state };
                    currentState.impliedVolRate = impliedVolRate;
                    this.updateState(currentState);
                }
            },
            this.handleError);
    }

    validate = () => {
        const options = { abortEarly: false };
        const { error } = Joi.validate(this.state.tradeOption, this.schema(), options);

        if (!error) return null;

        const errors = {};
        for (let item of error.details) {
            errors[item.path[0]] = item.message;
        }
        console.log(errors);
        return errors;
    };

    updateState(state) {
        let currentState = { ...state };

        const fldOption = currentState.tradeOption.option;
        const fldOptionSize =
            parseFloat(currentState.tradeOption.optionSize) > 0 ? parseFloat(currentState.tradeOption.optionSize) : 1;
        const fldMarketPrice = currentState.cryptoCurrency.marketPrice;
        const fldStrikePrice = 
            parseFloat(currentState.tradeOption.strikePrice) > 0 ? parseFloat(currentState.tradeOption.strikePrice) : fldMarketPrice;
//                ? parseFloat(currentState.tradeOption.strikePrice)
//                : currentState.cryptoCurrency.strikeRate;
        //const fldStrikeRate = currentState.cryptoCurrency.strikeRate;
        const fldImpliedVolRate = currentState.impliedVolRate;
        const fldHoldingPeriod = parseFloat(currentState.tradeOption.holdingPeriod);

        currentState.graphData.totalCost = TradingOption.getTotalCost(
            fldOption,
            fldOptionSize,
            fldMarketPrice,
            fldStrikePrice,
            //fldStrikeRate,
            fldImpliedVolRate,
            fldHoldingPeriod,
            fldHoldingPeriod,
        );

        currentState.graphData.breakEvenPrice = TradingOption.getBreakEven(
            fldOption,
            //fldOptionSize,
            fldMarketPrice,
            fldStrikePrice,
            //fldStrikeRate,
            fldImpliedVolRate,
            fldHoldingPeriod,
            fldHoldingPeriod,
        );

        this.setState(currentState);
    } 

    handleError = (err) => {
        console.log('error:', err);
        this.setState({
            errors: {
                error: err.toString()
            }
        });
    }

    handleBuyError = (err) => {
        console.log('buy error:', err);
        this.setState({
            errors: {
                buy: err.toString()
            }
        });
    }

    handleChange = ({ currentTarget: input }) => {
        const currentState = { ...this.state };

        currentState.components.holdingPeriodMessage = !currentState.components.holdingPeriodMessage;
        currentState.tradeOption[input.name] = input.value;

        this.updateState(currentState);
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const errors = this.validate();
        this.setState({ errors: errors || {} });
        if (errors) return;
        //Contracts.addContract(this.state.tradeOption);
        const option_type = (this.state.tradeOption.option === 'PUT' ? 1 : 0);
        const amount = parseFloat(this.state.tradeOption.optionSize);
        const strikePrice = parseFloat( this.state.tradeOption.strikePrice);
        const period = parseInt(this.state.tradeOption.holdingPeriod);
        const currency = this.state.tradeOption.currency;
        //const marketPrice = this.state.cryptoCurrency.marketPrice;
        const fee = this.state.graphData.totalCost;
        EosService.optionCreateCurr(amount.toFixed(4)+' EOS', strikePrice, period, option_type, currency, fee)
            .then(result => {
                this.setState({
                    errors: {},
                    refreshOptionList: !this.state.refreshOptionList,
                    refreshBalance: !this.state.refreshBalance,
                });
            },
            this.handleBuyError);
    };

    handleChangeCurrency = ({ currentTarget: currency }) => {
        const currentState = { ...this.state };
        currentState.components.holdingPeriodMessage = !currentState.components.holdingPeriodMessage;
        currentState.tradeOption.currency = currency.value;
        currentState.cryptoCurrency = Crypto.getCryptoCurrency(currency.value);
        this.setState(currentState);
        this.getMarketPrice();
    };

    handleGraph = ({}) => {};

    getBalance = (currency, callback) => {
        EosService.getCurrencyBalance(currency)
            .then(result => {
                const balance = result[0];
                this.setState({ balance });
                callback(balance);
            },
            this.handleError);
    }

    getPoolStat = (callback) => {
        EosService.poolStat()
            .then(result => {
                const poolStat = result.rows && result.rows[0];
                let maxOptionSize = 0;
                if (poolStat) {
                    const totalDeposit = parseFloat(poolStat.totaldeposit.split(' ')[0]);
                    const lockedAmount = parseFloat(poolStat.lockedamount.split(' ')[0]);
                    const lockedPremium = parseFloat(poolStat.lockedpremium.split(' ')[0]);
                    maxOptionSize = totalDeposit - lockedAmount - lockedPremium;
                }
                console.log('!!! maxOptionSize:', maxOptionSize);
                this.setState({ 
                    poolStat,
                    maxOptionSize,
                });
                callback(poolStat);
            },
            this.handleError);
    }

    render() {
        const { cryptoCurrency, tradeOption, graphData, errors, components } = this.state;
        return (
            <>
                {errors.error && <div className="alert alert-danger">{errors.error}</div>}
                {this.props.mode === 'home' && (
                    <Jumbotron
                        isLoggedIn={this.props.isLoggedIn}
                        onAttachWallet={this.props.onAttachWallet}
                        onDisconnectWallet={this.props.onDisconnectWallet}
                    />
                )}
                {this.props.isLoggedIn() && (
                    <div>
                        <div className="boxStyle p-4">
                            <h2>BUY AN OPTION CONTRACT</h2>
                            <hr />
                            <form className="row">
                                <div className="col-md-12 mb-5">
                                    <label className="form-label">Select Currency</label>
                                    <br />
                                    <select
                                        name="crypto"
                                        id="crypto"
                                        className="form-select"
                                        onChange={this.handleChangeCurrency}
                                    >
                                        {Crypto.getCryptoCurrencies().map((crypto) => (
                                            <option key={crypto.currency} value={crypto.currency}>
                                                {crypto.currency}
                                            </option>
                                        ))}
                                    </select>
                                    <CurrencyBalance
                                        getBalance={this.getBalance}
                                        currency={tradeOption.currency}
                                        refresh={this.state.refreshBalance}
                                        handleError={this.handleError} />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Option Type:</label>
                                    <br />
                                    <div className="btn-group" role="group" aria-label="Select option">
                                        <input
                                            type="radio"
                                            name="option"
                                            id="optionPut"
                                            className="btn-check"
                                            onChange={this.handleChange}
                                            value="PUT"
                                            checked={tradeOption.option.toString() === 'PUT'}
                                        />
                                        <label
                                            className={
                                                tradeOption.option.toString() === 'PUT'
                                                    ? 'btn btn-primary'
                                                    : 'btn btn-secondary'
                                            }
                                            htmlFor="optionPut"
                                        >
                                            PUT
                                        </label>
                                        <input
                                            type="radio"
                                            name="option"
                                            id="optionCall"
                                            className="btn-check"
                                            onChange={this.handleChange}
                                            value="CALL"
                                            checked={tradeOption.option.toString() === 'CALL'}
                                        />
                                        <label
                                            className={
                                                tradeOption.option.toString() === 'CALL'
                                                    ? 'btn btn-primary'
                                                    : 'btn btn-secondary'
                                            }
                                            htmlFor="optionCall"
                                        >
                                            CALL
                                        </label>
                                    </div>
                                    {errors.option && <div className="alert alert-danger">{errors.option}</div>}
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label label-default">Option Size:</label>
                                    <br />
                                    <div className="input-group mb-2">
                                        <input
                                            type="text"
                                            name="optionSize"
                                            id="optionSize"
                                            className="form-control"
                                            placeholder={parseFloat(process.env.REACT_APP_MIN_OPTION_SIZE || 1)}
                                            aria-label="EOS"
                                            value={tradeOption.optionSize}
                                            onChange={this.handleChange}
                                        />
                                        <span className="input-group-text" id="basic-addon2">
                                            EOS
                                        </span>
                                    </div>
                                    <div class="mb-3">Max: {(this.state.maxOptionSize || 0).toFixed(4)} EOS</div>
                                    {errors.optionSize && <div className="alert alert-danger">{errors.optionSize}</div>}
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Strike Price:</label>
                                    <br />
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            name="strikePrice"
                                            id="strikePrice"
                                            className="form-control"
                                            placeholder={/*cryptoCurrency.strikeRate*/cryptoCurrency.marketPrice.toFixed(2)}
                                            onChange={this.handleChange}
                                        />
                                        <span className="input-group-text" id="basic-addon2">
                                           USD
                                        </span>
                                    </div>
                                    {errors.strikePrice && <div className="alert alert-danger">{errors.strikePrice}</div>}
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label">Period of Holding:</label>
                                    <br />
                                    <select
                                        name="holdingPeriod"
                                        id="holdingPeriod"
                                        className="form-select"
                                        aria-label="Default select example"
                                        onChange={this.handleChange}
                                    >
                                        <option value="1">1 day</option>
                                        <option value="7">1 week (7 days)</option>
                                        <option value="14">2 weeks (14 days)</option>
                                        <option value="21">3 weeks (21 days)</option>
                                        <option value="28">4 weeks (28 days)</option>
                                    </select>
                                </div>

                                <div className="col-md-12">
                                    <HoldingPeriodMessage
                                        key={components.holdingPeriodMessage}
                                        option={tradeOption.option}
                                        holdingPeriod={tradeOption.holdingPeriod}
                                        strikePrice={
                                            parseInt(tradeOption.strikePrice) > 0
                                                ? tradeOption.strikePrice
                                                : cryptoCurrency.marketPrice.toFixed(2) //cryptoCurrency.strikeRate
                                        }
                                        breakEvenPrice={graphData.breakEvenPrice.toFixed(2)}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <HoldingPeriodChart
                                        strikePrice={
                                            parseInt(tradeOption.strikePrice) > 0
                                                ? tradeOption.strikePrice
                                                : cryptoCurrency.marketPrice.toFixed(2) //cryptoCurrency.strikeRate
                                        }
                                        marketPrice={cryptoCurrency.marketPrice}
                                        option={tradeOption.option}
                                        currentPrice={
                                            parseInt(tradeOption.strikePrice) > 0
                                                ? tradeOption.strikePrice
                                                : cryptoCurrency.marketPrice.toFixed(2) //cryptoCurrency.strikeRate
                                        }
                                        breakEvenPrice={graphData.breakEvenPrice}
                                        totalCost={graphData.totalCost}
                                    />
                                </div>
                                <div className="col-md-12">
                                    {!this.props.isLoggedIn() ? (
                                        <ConnectWallet
                                            isLoggedIn={this.props.isLoggedIn}
                                            onAttachWallet={this.props.onAttachWallet}
                                            onDisconnectWallet={this.props.onDisconnectWallet}
                                        />
                                    ) : [
                                        <button className="btn btn-primary" onClick={this.handleSubmit}>
                                            Buy Option Contract
                                        </button>,
                                        errors.buy && <div className="alert alert-danger mt-4">{errors.buy}</div>
                                    ]}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                <LiquidityPool 
                    getPoolStat={this.getPoolStat}
                    handleError={this.handleError} 
                />
                {this.props.mode !== 'home' && this.props.isLoggedIn() && (
                    <OptionContracts 
                        marketPrice={
                            cryptoCurrency.marketPrice
                        }
                        refresh={this.state.refreshOptionList} 
                        handleError={this.handleError} />
                )}
                <Features />
                {/*(<FaqPage />)*/}
            </>
        );
    }
}
