import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
//import Contracts from '../api/Contracts';
import SelectCurrency from './selectCurrency';
import OptionsPagination from './optionsPagination';
import Crypto from '../api/Crypto';

import EosService from '../eosio/EosService';

function OptionContracts(props) {
    const [key, setKey] = useState('active');
    const [userOptions, setUserOptions] = useState([]);
    const [allOptions, setAllOptions] = useState([]);
    const [userOptionError, setUserOptionError] = useState({});
    const [allOptionError, setAllOptionError] = useState({});
    const [currentUserPage, setCurrentUserPage] = useState(1);
    const [currentAllPage, setCurrentAllPage] = useState(1);
    const [optionsPerPage, setOptionsPerPage] = useState(10);
    const [loadChunkSize, setLoadChunkSize] = useState(20);
    const [showExpired, setShowExpired] = useState(false);

    const onChunkRows = (result, prevRows, topKey) => {
        //console.log('options result:', result);
        const rows = prevRows.concat(result.rows);
        if (result.more) {
            const nextKey = parseInt(result.next_key);
            if (nextKey > 0 && (!topKey || nextKey < topKey)) {
                EosService.optionList(loadChunkSize, result.next_key)
                    .then(result => onChunkRows(result, rows, nextKey),
                    props.handleError);
                return;
            }
        }
        const userRows = rows.filter(row => {
            return row.account === EosService.accountName() // && row.status === 'active'
        });
        if (currentUserPage > 1) {
            const lastPage = Math.floor((userRows.length + optionsPerPage - 1) / optionsPerPage);
            if (lastPage < currentUserPage) {
                setCurrentUserPage(lastPage || 1);
            }
        }
        setUserOptions(userRows);
        if (currentAllPage > 1) {
            const lastPage = Math.floor((rows.length + optionsPerPage - 1) / optionsPerPage);
            if (lastPage < currentAllPage) {
                setCurrentAllPage(lastPage || 1);
            }
        }
        setAllOptions(rows);
    }

    const load = () => {
        EosService.optionList(loadChunkSize)
            .then(result => onChunkRows(result, []),
            props.handleError);
    }

    const exercise = (optionid, currency, errorHandler) => {
        //console.log('exercise optionid=', optionid, ' currency=', currency);
        errorHandler({});
        EosService.optionExerciseCurr(optionid, currency)
            .then(result => {
                load();
            },
            (err) => errorHandler({
                option_id: optionid, 
                error: err
            }));
    }

    const userPaginate = (number) => {
        setUserOptionError({});
        setCurrentUserPage(number);
    }

    const allPaginate = (number) => {
        setAllOptionError({});
        setCurrentAllPage(number);
    }

    const onUserShowExpired = () => {
        setShowExpired(!showExpired);
        setCurrentUserPage(1);
    }

    const onAllShowExpired = () => {
        setShowExpired(!showExpired);
        setCurrentAllPage(1);
    }

    const setTab = (k) => {
        userPaginate(1);
        allPaginate(1);
        setKey(k);
    }

    useEffect(() => {
        load();
        return () => {};
    }, [props.refresh]);

    const now = Date.now();

    const showUserOptions = showExpired ? userOptions : userOptions.filter(option => {    
        const expiration = Date.parse(option.expiration);
        return !(expiration <= now);
    });
    const indexOfLastUserOption = currentUserPage * optionsPerPage;
    const indexOfFirstUserOption = indexOfLastUserOption - optionsPerPage;
    const currentUserOptions = showUserOptions.slice(indexOfFirstUserOption, indexOfLastUserOption);

    const showAllOptions = showExpired ? allOptions : allOptions.filter(option => {    
        const expiration = Date.parse(option.expiration);
        return !(expiration <= now);
    });
    const indexOfLastAllOption = currentAllPage * optionsPerPage;
    const indexOfFirstAllOption = indexOfLastAllOption - optionsPerPage;
    const currentAllOptions = showAllOptions.slice(indexOfFirstAllOption, indexOfLastAllOption);

    function pad(number, length) {
        let str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }

    function formatExpiration(expiration) {
        const ud = new Date(expiration);
        const d =  new Date(ud.getTime() - ud.getTimezoneOffset() * 60 * 1000);
        //return d.toISOString();
        let s = d.getFullYear().toString() + '-' +
            pad(d.getMonth() + 1, 2) + '-' +
            pad(d.getDate(), 2) + ' ' +
            pad(d.getHours(), 2) + ':' +
            pad(d.getMinutes(), 2);
        const nsec = d.getSeconds();
        if (nsec) {
            s += ':' + pad(nsec, 2);
        }
        return s;
    }

    return (
        <div className="liquidityPool boxStyle  p-4">
            <h2>OPTIONS CONTRACTS</h2>
            <hr />
            <Tabs id="controlled-tab-example" activeKey={key} onSelect={(k) => setTab(k)}>
                <Tab eventKey="active" title="Own">
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Type</th>
                                <th scope="col">Strike</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Premium</th>
                                <th scope="col">Paid</th>
                                <th scope="col">P&L</th>
                                <th scope="col">Expiration</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUserOptions.map(option => {
                                //console.log('option:', option);
                                const expiration = Date.parse(option.expiration);
                                //console.log('expiration:', expiration, 'now:', now);
                                const expired = expiration <= now;
                                const strikePrice = parseFloat(option.strike);
                                //console.log('strikePrice:', strikePrice);
                                //console.log('marketPrice:', props.marketPrice);
                                const priceTooLow = (option.optiontype === 0) && (props.marketPrice < strikePrice);
                                const priceTooHigh = (option.optiontype === 1) && (props.marketPrice > strikePrice);
                                let prempaidsym = option.prempaidsym;
                                if (process.env.REACT_APP_TEST_MARKET_PRICE) {
                                    prempaidsym = (parseFloat(option.premium.split(' ')[0]) * 6.2).toFixed(4) + ' USDC';
                                }
                                const prempaid = parseFloat(prempaidsym.split(' ')[0]);
                                const paidcurrency = prempaidsym.split(' ')[1];
                                const paidmp = Crypto.getMarketPrice(paidcurrency);
                                const strike = parseFloat(option.strike);
                                const amount = parseFloat(option.amount.split(' ')[0]);
                                const profit = option.optiontype == '1' ? ((strike - paidmp) * amount) - prempaid : ((paidmp - strike) * amount) - prempaid;
                                let rows = [
                                    <tr>
                                        <td>{option.id}</td>
                                        <td>{option.optiontype == '1' ? 'PUT' : 'CALL'}</td>
                                        <td>{strike.toFixed(4)}</td>
                                        <td>{option.amount}</td>
                                        <td>{option.premium}</td>
                                        <td>{prempaidsym}</td>
                                        {profit >= 0 ? (<td>{profit.toFixed(4)} {paidcurrency}</td>) : (<td className='text-danger'>LOSS</td>)}
                                        <td>{formatExpiration(expiration)}</td>
                                        <td>
                                            {option.status === 'active' && !expired && !priceTooLow && !priceTooHigh && (
                                                <SelectCurrency onSelectCurrency={({ type: currency }) => exercise(option.id, currency, setUserOptionError)} />
                                            )}
                                            {option.status === 'active' && expired && 'expired'}
                                            {option.status === 'active' && !expired && priceTooLow && 'price too low'}
                                            {option.status === 'active' && !expired && priceTooHigh && 'price too high'}
                                            {option.status !== 'active' && option.status}
                                        </td>
                                    </tr>
                                ]; 
                                if (userOptionError.error && userOptionError.option_id === option.id) {                                    
                                    rows.push(
                                        <tr>
                                            <td colspan="7"><div className="alert alert-danger">{userOptionError.error.toString()}</div></td>
                                        </tr>
                                    );
                                }
                                return rows;
                            })}
                        </tbody>
                    </table>
                    <OptionsPagination 
                        optionsPerPage={optionsPerPage} 
                        totalOptions={showUserOptions.length} 
                        paginate={userPaginate}
                        showExpired={showExpired}
                        onShowExpired={onUserShowExpired}
                        />
                </Tab>
                <Tab eventKey="all" title="All">
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Account</th>
                                <th scope="col">Type</th>
                                <th scope="col">Strike</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Premium</th>
                                <th scope="col">Paid</th>
                                <th scope="col">P&L</th>
                                <th scope="col">Expiration</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAllOptions.map(option => {
                                //console.log('option:', option);
                                const expiration = Date.parse(option.expiration);
                                const expiration_1h = expiration - 3600000;
                                //console.log('expiration:', expiration,  'expiration_1h:', expiration_1h, 'now:', now);
                                const expired = expiration <= now;
                                const expired_1h = expiration_1h <= now;
                                //if (expired_1h) console.log('expired_1h:', expired_1h);
                                const strikePrice = parseFloat(option.strike);
                                //console.log('strikePrice:', strikePrice);
                                //console.log('marketPrice:', props.marketPrice);
                                const priceTooLow = (option.optiontype === 0) && (props.marketPrice < strikePrice);
                                const priceTooHigh = (option.optiontype === 1) && (props.marketPrice > strikePrice);
                                let prempaidsym = option.prempaidsym;
                                if (process.env.REACT_APP_TEST_MARKET_PRICE) {
                                    prempaidsym = (parseFloat(option.premium.split(' ')[0]) * 6.2).toFixed(4) + ' USDC';
                                }
                                const prempaid = parseFloat(prempaidsym.split(' ')[0]);
                                const paidcurrency = prempaidsym.split(' ')[1];
                                const paidmp = Crypto.getMarketPrice(paidcurrency);
                                const strike = parseFloat(option.strike);
                                const amount = parseFloat(option.amount.split(' ')[0]);
                                const profit = option.optiontype == '1' ? ((strike - paidmp) * amount) - prempaid : ((paidmp - strike) * amount) - prempaid;
                                let rows = [
                                    <tr>
                                        <td>{option.id}</td>
                                        <td>{option.account}</td>
                                        <td>{option.optiontype == '1' ? 'PUT' : 'CALL'}</td>
                                        <td>{strike.toFixed(4)}</td>
                                        <td>{option.amount}</td>
                                        <td>{option.premium}</td>
                                        <td>{prempaidsym}</td>
                                        {profit >= 0 ? (<td>{profit.toFixed(4)} {paidcurrency}</td>) : (<td className='text-danger'>LOSS</td>)}
                                        <td>{formatExpiration(expiration)}</td>
                                        <td>
                                            {option.status === 'active' && !expired && !priceTooLow && !priceTooHigh && (
                                                ((option.account === EosService.accountName() || expired_1h) && 
                                                    <SelectCurrency onSelectCurrency={({ type: currency }) => exercise(option.id, currency, setAllOptionError)} />
                                                ) || option.status
                                            )}
                                            {option.status === 'active' && expired && 'expired'}
                                            {option.status === 'active' && !expired && priceTooLow && 'price too low'}
                                            {option.status === 'active' && !expired && priceTooHigh && 'price too high'}
                                            {option.status !== 'active' && option.status}
                                        </td>
                                    </tr>
                                ]; 
                                if (allOptionError.error && allOptionError.option_id === option.id) {
                                    rows.push(
                                        <tr>
                                            <td colspan="8"><div className="alert alert-danger">{allOptionError.error.toString()}</div></td>
                                        </tr>
                                    );
                                }
                                return rows;
                            })}
                        </tbody>
                    </table>
                    <OptionsPagination 
                        optionsPerPage={optionsPerPage} 
                        totalOptions={showAllOptions.length} 
                        paginate={allPaginate}
                        showExpired={showExpired}
                        onShowExpired={onAllShowExpired}
                        />
                </Tab>
            </Tabs>
        </div>
    );
}

export default OptionContracts;
