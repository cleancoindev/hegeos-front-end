import React, { useState, useEffect } from 'react';

import EosService from '../eosio/EosService';

export default function LiquidityPool(props) {

    const [poolStat, setPoolStat] = useState(null);
    const [availabilityMin, setAvailabilityMin] = useState(0);
    const [availabilityMax, setAvailabilityMax] = useState(0);
    const [utilizationRate, setUtilizationRate] = useState(0); 

    const load = () => {
        props.getPoolStat(poolStat => {
            const totalDeposit = poolStat && parseFloat(poolStat.totaldeposit.split(' ')[0]);
            const lockedAmount = poolStat && parseFloat(poolStat.lockedamount.split(' ')[0]);
            const rate = totalDeposit && (lockedAmount * 100 / totalDeposit).toFixed(2);
            setPoolStat(poolStat);
            setAvailabilityMin(lockedAmount);
            setAvailabilityMax(totalDeposit);
            setUtilizationRate(rate);
        });        
    }

    useEffect(() => {
        load();
        return () => {}; 
    }, [props.refresh]);

    return (
        <div className="liquidityPool boxStyle  p-4">
            <h2>LIQUIDITY POOL</h2>
            <hr />

            <div className="row">
                <div className="col-md-6">
                    Utilization Rate :<br />
                    <h3>{utilizationRate + '%'}</h3>
                </div>
                <div className="col-md-6">
                    Available Liquidity :<br />
                    <h3>{availabilityMin + ' EOS / ' + availabilityMax + ' EOS'}</h3>
                </div>
                <div className="col-md-12">
                    <div className="progress">
                        <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{ width: utilizationRate + '%' }}
                            aria-valuenow={utilizationRate}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
