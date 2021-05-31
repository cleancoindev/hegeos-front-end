import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PieChart from '../pieChart';
import Joi from 'joi-browser';
import LiquidityPool from '../liquidityPool';
import CurrencyBalance from '../currencyBalance';

import EosService from '../../eosio/EosService';

const pjson = require('../../../package.json');

const liquidityData = {
    currency: 'EOS',
    liquidityProvider: 1,
    PnL: 2,
    share: 200,
    poolSize: 32154656,
};

function Liquidity(props) {
    const [depositAmount, setDepositAmount] = useState(1);
    const [withdrawAmount, setWithdrawAmount] = useState(1);

    const [errors, setErrors] = useState({});
    const [refreshPool, setRefreshPool] = useState(false);
    const [currentRate, setCurrentRate] = useState(1);
    const [refreshBalance, setRefreshBalance] = useState(false);
    const [count, setCount] = useState(0);

    const sharePool = (share, poolSize) => {
        return (poolSize / share) * 100;
    };

    const validateDeposit = () => {
        const { error } = Joi.validate(
            { 
                depositAmount 
            }, 
            {
                depositAmount: Joi.number().required().label('Deposited Amount'),
            }, 
            { abortEarly: false }
        );

        if (!error) return null;

        const errors = {};
        for (let item of error.details) {
            errors[item.path[0]] = item.message;
        }
        console.log(errors);
        return errors;
    }

    const validateWithdraw = () => {
        const { error } = Joi.validate(
            { 
                withdrawAmount 
            }, 
            {
                withdrawAmount: Joi.number().required().label('Withdrawal Amount'),
            }, 
            { abortEarly: false }
        );

        if (!error) return null;

        const errors = {};
        for (let item of error.details) {
            errors[item.path[0]] = item.message;
        }
        console.log(errors);
        return errors;
    }

    const handleDepositAmountChange = ({ currentTarget: input }) => {
        setDepositAmount(input.value);
    };

    const handleWithdrawAmountChange = ({ currentTarget: input }) => {
        setWithdrawAmount(input.value);
    };

    const handleError = (err) => {
        console.log(err);
        setErrors({
            error: err.toString()
        });
    }

    const handleDepositError = (err) => {
        console.log(err);
        setErrors({
            deposit: err.toString()
        });
    }

    const handleWithdrawError = (err) => {
        console.log(err);
        setErrors({
            withdraw: err.toString()
        });
    }

    const handleDeposit = (e) => {
        const errors = validateDeposit();
        setErrors(errors || {});
        if (errors) return;
        const amount = parseFloat(depositAmount);
        console.log('deposit amount:', amount);
        EosService.poolDeposit(amount.toFixed(4)+' EOS', '0.0000 '+process.env.REACT_APP_HEGEOS_SYMBOL)
            .then(result => {
                setErrors({});
                setRefreshPool(!refreshPool);
            },
            handleDepositError)
    };

    const handleWithdraw = (e) => {
        const errors = validateWithdraw();
        setErrors(errors || {});
        if (errors) return;
        const amount = parseFloat(withdrawAmount);
        const maxburn = amount * currentRate;
        console.log('withdraw amount:', amount, 'maxbirn:', maxburn);
        EosService.poolWithdraw(amount.toFixed(4)+' EOS', maxburn.toFixed(4)+' '+process.env.REACT_APP_HEGEOS_SYMBOL)
            .then(result => {
                setErrors({});
                setRefreshPool(!refreshPool);
            },
            handleWithdrawError)
    };

    const sharedPool = sharePool(liquidityData.poolSize, liquidityData.share);

    const getBalance = (currency, callback) => {
        EosService.getCurrencyBalance(currency)
            .then(result => {
                const balance = result[0];
                callback(balance);
            },
            handleError);
    }

    const getPoolStat = (callback) => {
        EosService.poolStat()
            .then(result => {
                const poolStat = result.rows && result.rows[0];
                console.log('pool stat:', poolStat)
                callback(poolStat);
                EosService.hegeosStat()
                    .then(result => {
                        const hegeosStat = result.rows && result.rows[0];
                        console.log('HEGEOS stat:', hegeosStat);
                        if (poolStat && hegeosStat) {
                            const totaldeposit = parseFloat(poolStat.totaldeposit.split(' ')[0]);
                            const lockedpremium = parseFloat(poolStat.lockedpremium.split(' ')[0]);
                            const supply = parseFloat(hegeosStat.supply.split(' ')[0]);
                            console.log('totaldeposit:', totaldeposit);
                            console.log('lockedpremium:', lockedpremium);
                            console.log('supply:', supply);
                            if (totaldeposit > lockedpremium && supply > 0) {
                                const hegeosRate = supply / (totaldeposit - lockedpremium);
                                console.log('HEGEOS rate:', hegeosRate);
                                setCurrentRate(hegeosRate);
                            }
                        }
                    },
                    handleError);
            },
            handleError);
    }

    useEffect(() => {
        const updateInterval = setInterval(() => {
            setRefreshPool(prev => !prev);
            setRefreshBalance(prev => !prev);
            setCount(prev => prev+1);
        }, 5000); //update every 5 seconds
        return () => clearInterval(updateInterval);
    }, []);

    return (
        <div className="row">
            <div className="col-md-7 pt-md-5">
                <h2>EARN YIELD ON {liquidityData.currency} AS A LIQUIDITY PROVIDER</h2>
                <p>
                    Provide liquidity to a non-custodial pool. EOS Pool is used for selling CALL
                    and PUT options. Earn premiums in an automated way.
                </p>
                {/*(<Link to={pjson.homepage+"/faq"}>How Hegios.io works?</Link>)*/}
            </div>
            { /* (<div className="col-md-5">
                <img src={pjson.homepage+"/images/benefits-6.png"} className="w-100" />
            </div>) */ }

            { /* (<div className="col-md-12">
                <h2>EARN YIELD ON {liquidityData.currency} AS A LIQUIDITY PROVIDER</h2>
                <div className="boxStyle  p-2">
                    <div className="row">
                        <div className="col-md-3">
                            <PieChart
                                liquidity={liquidityData.liquidityProvider}
                                pnl={liquidityData.PnL}
                            />
                        </div>
                        <div className="col-md-4">
                            <div class="callout callout-strike p-4">
                                <span>Liquidity Provider</span>
                                <h3>0 USD</h3>
                            </div>
                            <div class="callout callout-total p-5">
                                <span>Net P&L</span>
                                <h3>0 USD</h3>
                                <a className="btn btn-warning">Withdraw net Profits</a>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div class="callout callout-even h-100">
                                <h2>P&L Dynamics</h2>
                                <p>this will be added soon.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>) */ }

            { /* (<div className="col-md-12">
                <div className="liquidityPool boxStyle  p-4">
                    <div className="row">
                        <div className="col-md-6">
                            Your Share in the Pool :<br />
                            <h3>{sharedPool + '%'}</h3>
                        </div>
                        <div className="col-md-6">
                            {liquidityData.currency} Pool Size :<br />
                            <h3>
                                {liquidityData.share + ' ' +
                                    liquidityData.currency + 
                                    ' / ' +
                                    liquidityData.poolSize + ' ' +
                                    liquidityData.currency}
                            </h3>
                        </div>
                        <div className="col-md-12">
                            <div className="progress">
                                <div
                                    className="progress-bar bg-primary"
                                    role="progressbar"
                                    style={{ width: sharedPool + '%' }}
                                    aria-valuenow={sharedPool}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>) */ }
            {errors.error && <div className="alert alert-danger">{errors.error}</div>}
            {props.isLoggedIn() && (
                <div className="col-md-12">
                    <h2>PROVIDE LIQUIDITY</h2>
                    <p>
                        <CurrencyBalance
                            getBalance={getBalance}
                            currency='EOS'
                            refresh={refreshBalance}
                            handleError={handleError} />
                    </p>
                    <hr />
                    <div className=" boxStyle p-4">
                        <div className="callout callout-even small">
                            Liquidity (liquidity providers) receive {process.env.REACT_APP_HEGEOS_SYMBOL} tokens that give them a share in
                            the pool's premiums that are distributed to them after the options contracts
                            expiration. When a writer wishes to receive their {liquidityData.currency}{' '}
                            back, he should call the Withdraw function of the contract and burn {process.env.REACT_APP_HEGEOS_SYMBOL}
                            tokens. {liquidityData.currency} will be sent to the writer’s{' '}
                            address. Attention: do not send {process.env.REACT_APP_HEGEOS_SYMBOL} tokens to the
                            contract address because you will lose your funds.
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <br />
                                <div className="input-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="1"
                                        aria-label="EOS"
                                        value={depositAmount}
                                        onChange={handleDepositAmountChange}
                                    />
                                    <span className="input-group-text" id="basic-addon2">
                                        EOS
                                    </span>
                                </div>
                                {errors.depositAmount && <div className="alert alert-danger">{errors.depositAmount}</div>}
                            </div>
                            <div className="col-sm-4 text-center with-arrow">
                                <div className="provide-liquidity__arrow"></div>
                            </div>
                            <div className="col-sm-4">
                                {' '}
                                <br />
                                <div className="input-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="1"
                                        aria-label={process.env.REACT_APP_HEGEOS_SYMBOL}
                                        readonly="true"
                                        value={(depositAmount * currentRate).toFixed(2)}
                                    />
                                    <span className="input-group-text" id="basic-addon2">
                                        {process.env.REACT_APP_HEGEOS_SYMBOL}
                                    </span>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <a className="btn btn-primary col-md-12" onClick={() => handleDeposit()}>
                                    Deposit
                                </a>
                                {errors.deposit && <div className="alert alert-danger mt-4">{errors.deposit}</div>}
                                <p className="small pt-4">
                                    Click the "Deposit" button and {depositAmount} {liquidityData.currency}{' '}
                                    will be sent from your {liquidityData.currency} address to the liquidity pool contract.
                                    After the transaction is confirmed by miners, you will automatically
                                    receive {process.env.REACT_APP_HEGEOS_SYMBOL} tokens. These tokens will
                                    give you a share in premiums paid by the options holders.
                                </p>
                            </div>
                            <div className="col-sm-4">
                                <br />
                                <div className="input-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="1"
                                        aria-label={process.env.REACT_APP_HEGEOS_SYMBOL}
                                        value={withdrawAmount}
                                        onChange={handleWithdrawAmountChange}
                                    />
                                    <span className="input-group-text" id="basic-addon2">
                                        {process.env.REACT_APP_HEGEOS_SYMBOL}
                                    </span>
                                </div>
                                {errors.withdrawAmount && <div className="alert alert-danger">{errors.withdrawAmount}</div>}
                            </div>
                            <div className="col-sm-4 text-center with-arrow">
                                <div className="provide-liquidity__arrow"></div>
                            </div>
                            <div className="col-sm-4">
                                {' '}
                                <br />
                                <div className="input-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="1"
                                        aria-label="EOS"
                                        readonly="true"
                                        value={(withdrawAmount * currentRate).toFixed(2)}
                                    />
                                    <span className="input-group-text" id="basic-addon2">
                                        EOS
                                    </span>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <a className="btn btn-primary col-md-12" onClick={() => handleWithdraw()}>
                                    Withdraw
                                </a>
                                {errors.withdraw && <div className="alert alert-danger mt-4">{errors.withdraw}</div>}
                                <p className="small pt-4">
                                    Click the "Withdraw" button and {withdrawAmount} {liquidityData.currency}{' '}
                                    will be sent to your {liquidityData.currency} address.
                                </p>
                            </div>
                            <hr />
                            <div className="row text-center">
                                <div className="col-sm-4">
                                    <h3>TBA</h3>Avg. Returns (30 Days)
                                </div>
                                <div className="col-sm-4">
                                    <h3>TBA</h3>Projected Returns (APY)
                                </div>
                                <div className="col-sm-4">
                                    <h3>TBA</h3>Gross Premiums Earned by Writers
                                </div>
                            </div>
                        </div>
                    </div>
                    <LiquidityPool 
                        getPoolStat={getPoolStat}
                        refresh={refreshPool} 
                        handleError={props.handleError} 
                    />
                </div>
            )}
        </div>
    );
}

export default Liquidity;
