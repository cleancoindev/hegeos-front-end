import React, { useState, useEffect } from 'react';
import EosService from '../eosio/EosService';

export default function CurrencyBalance(props) {
    const [balance, setBalance] = useState();

    const load = () => {
        props.getBalance(props.currency, balance => {
            setBalance(balance);
        });
    }

    useEffect(() => {
        load();
        return () => {};
    }, [props.refresh, props.currency]);

    return (
        <div className='mt-2'>
            Balance: {balance}
        </div>
    );
}