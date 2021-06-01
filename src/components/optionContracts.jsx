import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
//import Contracts from '../api/Contracts';
import SelectCurrency from './selectCurrency';

import EosService from '../eosio/EosService';

function OptionContracts(props) {
    const [pageSize, setPageSize] = useState(100);
    const [key, setKey] = useState('active');
    const [userOptions, setUserOptions] = useState([]);
    const [optionError, setOptionError] = useState({});

    const pageRows = (result, prevRows, topKey) => {
        console.log('options result:', result);
        const rows = prevRows.concat(result.rows);
        setUserOptions(rows.filter(row => {
            return row.account === EosService.accountName() // && row.status === 'active'
        }));
        setOptionError({});
        if (result.more) {
            const nextKey = parseInt(result.next_key);
            if (nextKey > 0 && (!topKey || nextKey < topKey)) {
                EosService.optionList(pageSize, result.next_key)
                    .then(result => pageRows(result, rows, nextKey),
                    props.handleError);
            }
        }
    }

    const load = () => {
        setOptionError({});
        EosService.optionList(pageSize)
            .then(result => pageRows(result, []),
            props.handleError);
    }

    const exercise = (optionid, currency) => {
        //console.log('exercise optionid=', optionid, ' currency=', currency);
        EosService.optionExerciseCurr(optionid, currency)
            .then(result => {
                load();
            },
            (err) => setOptionError({
                option_id: optionid, 
                error: err
            }));
    }

    useEffect(() => {
        load();
        return () => {};
    }, [props.refresh]);

    return (
        <div className="liquidityPool boxStyle  p-4">
            <h2>YOUR OPTIONS CONTRACTS</h2>
            <hr />
            <Tabs id="controlled-tab-example" activeKey={key} onSelect={(k) => setKey(k)}>
                <Tab eventKey="active" title="Active">
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
                            {userOptions.map(option => {
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
                                                <SelectCurrency onSelectCurrency={({ type: currency }) => exercise(option.id, currency)} />
                                            )}
                                            {option.status === 'active' && expired && 'Expired'}
                                            {option.status === 'active' && !expired && priceTooLow && 'Price too low'}
                                            {option.status === 'active' && !expired && priceTooHigh && 'Price too high'}
                                            {option.status !== 'active' && option.status}
                                        </td>
                                    </tr>
                                ]; 
                                if (optionError.error && optionError.option_id === option.id) {
                                    rows.push(
                                        <tr>
                                            <td colspan="7"><div className="alert alert-danger">{optionError.error.toString()}</div></td>
                                        </tr>
                                    );
                                }
                                return rows;
                            })}
                        </tbody>
                    </table>
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
