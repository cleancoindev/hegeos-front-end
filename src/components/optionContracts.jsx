import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
//import Contracts from '../api/Contracts';
import SelectCurrency from './selectCurrency';
import OptionsPagination from './optionsPagination';

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

    const onChunkRows = (result, prevRows, topKey) => {
        console.log('options result:', result);
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

    const setTab = (k) => {
        userPaginate(1);
        allPaginate(1);
        setKey(k);
    }

    useEffect(() => {
        load();
        return () => {};
    }, [props.refresh]);

    const indexOfLastUserOption = currentUserPage * optionsPerPage;
    const indexOfFirstUserOption = indexOfLastUserOption - optionsPerPage;
    const currentUserOptions = userOptions.slice(indexOfFirstUserOption, indexOfLastUserOption);

    const indexOfLastAllOption = currentAllPage * optionsPerPage;
    const indexOfFirstAllOption = indexOfLastAllOption - optionsPerPage;
    const currentAllOptions = allOptions.slice(indexOfFirstAllOption, indexOfLastAllOption);

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
                                <th scope="col">Strike</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Premium</th>
                                <th scope="col">Expiration</th>
                                <th scope="col">Type</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUserOptions.map(option => {
                                //console.log('option:', option);
                                const expiration = Date.parse(option.expiration);
                                //console.log('expiration:', expiration, 'now:', Date.now());
                                const expired = expiration <= Date.now();                                
                                const strikePrice = parseFloat(option.strike);
                                //console.log('strikePrice:', strikePrice);
                                //console.log('marketPrice:', props.marketPrice);
                                const priceTooLow = (option.optiontype === 0) && (props.marketPrice < strikePrice);
                                const priceTooHigh = (option.optiontype === 1) && (props.marketPrice > strikePrice);
                                let rows = [
                                    <tr>
                                        <td>{option.id}</td>
                                        <td>{parseFloat(option.strike).toFixed(4)}</td>
                                        <td>{option.amount}</td>
                                        <td>{option.premium}</td>
                                        <td>{option.expiration}</td>
                                        <td>{option.optiontype == '1' ? 'PUT' : 'CALL'}</td>
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
                        totalOptions={userOptions.length} 
                        paginate={userPaginate}
                        />
                </Tab>
                <Tab eventKey="all" title="All">
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Account</th>
                                <th scope="col">Strike</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Premium</th>
                                <th scope="col">Expiration</th>
                                <th scope="col">Type</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAllOptions.map(option => {
                                //console.log('option:', option);
                                const expiration = Date.parse(option.expiration);
                                const expiration_1h = expiration - 3600000;
                                //console.log('expiration:', expiration,  'expiration_1h:', expiration_1h, 'now:', Date.now());
                                const expired = expiration <= Date.now();
                                const expired_1h = expiration_1h <= Date.now();
                                //if (expired_1h) console.log('expired_1h:', expired_1h);
                                const strikePrice = parseFloat(option.strike);
                                //console.log('strikePrice:', strikePrice);
                                //console.log('marketPrice:', props.marketPrice);
                                const priceTooLow = (option.optiontype === 0) && (props.marketPrice < strikePrice);
                                const priceTooHigh = (option.optiontype === 1) && (props.marketPrice > strikePrice);
                                let rows = [
                                    <tr>
                                        <td>{option.id}</td>
                                        <td>{option.account}</td>
                                        <td>{parseFloat(option.strike).toFixed(4)}</td>
                                        <td>{option.amount}</td>
                                        <td>{option.premium}</td>
                                        <td>{option.expiration}</td>
                                        <td>{option.optiontype == '1' ? 'PUT' : 'CALL'}</td>
                                        <td>
                                            {option.status === 'active' && !expired && !priceTooLow && !priceTooHigh && (
                                                (expired_1h && 
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
                        totalOptions={allOptions.length} 
                        paginate={allPaginate}
                        />
                </Tab>
                {/*(<Tab eventKey="history" title="History">
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Strike</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Premium</th>
                                <th scope="col">Expiration</th>
                                <th scope="col">Type</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {userOptions.filter(option => {
                                return option.account === EosService.accountName() && option.status !== 'active'
                            }).map(option => {
                                return (<tr>
                                        <td>{option.id}</td>
                                        <td>{parseFloat(option.strike).toFixed(4)}</td>
                                        <td>{option.amount}</td>
                                        <td>{option.premium}</td>
                                        <td>{option.expiration}</td>
                                        <td>{option.optiontype}</td>
                                        <td></td>
                                    </tr>);
                            })}
                        </tbody>
                    </table>
                </Tab>)*/}
                { /* 
                (<Tab eventKey="active" title="Active">
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">Type</th>
                                <th scope="col">Size</th>
                                <th scope="col">Strike Price</th>
                                <th scope="col">Price Now</th>
                                <th scope="col">Break Even</th>
                                <th scope="col">P&L</th>
                                <th scope="col">Placed At</th>
                                <th scope="col">Expires At</th>
                                <th scope="col">Expires In</th>
                                <th scope="col">Exercise</th>
                                <th scope="col">Share</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Contracts.getActiveContracts().map((contact) => (
                                <tr>
                                    <td>{contact.optionType}</td>
                                    <td>{contact.optionSize}</td>
                                    <td>{contact.strikePrice}</td>
                                    <td>{contact.priceNow}</td>
                                    <td>{contact.breakEven}</td>
                                    <td>{contact.plRealized}</td>
                                    <td>{contact.placedAt}</td>
                                    <td>{contact.expiresAt}</td>
                                    <td>{contact.expiresIn}</td>
                                    <td>{contact.exercise}</td>
                                    <td>{contact.share}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Tab>
                <Tab eventKey="history" title="History">
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th scope="col">Type</th>
                                <th scope="col">Size</th>
                                <th scope="col">Strike Price</th>
                                <th scope="col">Placed At</th>
                                <th scope="col">Expires At</th>
                                <th scope="col">P&L Realized</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Contracts.getActiveContracts().map((contact) => (
                                <tr>
                                    <td>{contact.optionType}</td>
                                    <td>{contact.optionSize}</td>
                                    <td>{contact.strikePrice}</td>
                                    <td>{contact.placedAt}</td>
                                    <td>{contact.plRealized}</td>
                                    <td>{contact.expiresAt}</td>
                                    <td>{contact.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>{' '}
                </Tab>) 
                */ }
            </Tabs>
        </div>
    );
}

export default OptionContracts;
