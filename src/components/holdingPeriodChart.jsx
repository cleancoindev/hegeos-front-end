import React from 'react';

import { useSpring, animated } from 'react-spring';

const getChartPos = (option, marketPrice, strikePrice, breakEvenPrice) => {
    let posValue = 50;
    const mp100 = parseInt(marketPrice * 100);
    const sp100 = parseInt(strikePrice * 100);
    const be100 = parseInt(breakEvenPrice * 100);
    const d100 = Math.abs(be100-sp100);
    console.log('mp100:', mp100, ', sp100:', sp100, ', be100:', be100, ', d:', d100);    
    if (option === 'CALL') {
        if (mp100 >= be100+d100) {
            posValue = 0;
        }
        else if (mp100 >= be100) { // && (mp100 < be100+d100) => d100 > 0
            posValue = 32 - Math.round((mp100-be100) * 32 / d100);
        }
        else if (mp100 <= sp100-d100) {
            posValue = 96;
        }
        else if (mp100 <= sp100) { // && (mp100 > sp100-d100) => d100 > 0
            posValue = 64 + Math.round((sp100-mp100) * 32 / d100);
        }
        else { // (mp100 < be100) && (mp100 > sp100) => d100 > 0
            posValue = 64 - Math.round((mp100-sp100) * 32 / d100);
        }
    }
    else if (option === 'PUT') {
        if (mp100 >= sp100+d100) {
            posValue = 0;
        }
        else if (mp100 >= sp100) { // && (mp100 < sp100+d100) => d100 > 0
            posValue = 32 - Math.round((mp100-sp100) * 32 / d100);
        }
        else if (mp100 <= be100-d100) {
            posValue = 96;
        }
        else if (mp100 <= be100) { // && (mp100 > be100-d100) => d100 > 0
            posValue = 64 + Math.round((be100-mp100) * 32 / d100);
        }
        else { // (mp100 < sp100) && (mp100 > be100) => d100 > 0
            posValue = 64 - Math.round((mp100-be100) * 32 / d100);
        }
    } else {
        posValue = 48;
    }
    return posValue * 2.8;
};

export default function HoldingPeriodChart({ option, strikePrice, breakEvenPrice, marketPrice, totalCost }) {
    const propsMarketPrice = useSpring({
        to: { y: getChartPos(option, marketPrice, strikePrice, breakEvenPrice) },
        from: { y: 0 },
    });

    const propsBreakEvenPrice = useSpring({
        to: { y: option === 'CALL' ? -91 : 0 },
        from: { y: 0 },
    });
    const propsStrikePrice = useSpring({
        to: { y: option === 'CALL' ? 91 : 0 },
        from: { y: 0 },
    });

    return (
        <div className="row">
            <div className="col-md-8">
                <div className="optionChart">
                    <animated.div
                        className="chartPriceDisplay chartOptionCurrent"
                        style={propsMarketPrice}
                        data-value={'Current $' + parseFloat(marketPrice).toFixed(2) + (process.env.REACT_APP_TEST_MARKET_PRICE ? ' (test)' : '')}
                    ></animated.div>
                    <animated.div
                        style={propsBreakEvenPrice}
                        className="chartPriceDisplay chartOptionBreakEven"
                        data-value={'Break Even $' + parseFloat(breakEvenPrice).toFixed(2)}
                    ></animated.div>
                    <animated.div
                        style={propsStrikePrice}
                        className="chartPriceDisplay chartOptionStrikePrice"
                        data-value={'Strike Price $' + parseFloat(strikePrice).toFixed(2)}
                    ></animated.div>
                    <div className={option.toLowerCase() + 'OptionHeader'}>
                        <div className="chartGridLine"></div>
                        <div className="chartGridLine"></div>
                        <div className={option.toLowerCase() + 'TopLine chartGridLine'}></div>
                    </div>
                    <div>
                        <div className={option.toLowerCase() + 'Line chartGridLine'}></div>
                        <div className="chartGridLine"></div>
                        <div className="chartGridLine"></div>
                    </div>
                    <div className={option.toLowerCase() + 'OptionFooter'}>
                        <div className={option.toLowerCase() + 'BotLine chartGridLine'}></div>
                        <div className="chartGridLine"></div>
                        <div className="chartGridLine"></div>
                    </div>
                </div>
            </div>
            <div className="col-md-4">
                <div className="callout callout-strike">
                    <span>Strike Price</span>
                    <h3>${parseFloat(strikePrice).toFixed(2)}</h3>
                </div>
                <div className="callout callout-total">
                    <span>Total Cost</span>
                    <h3>${parseFloat(totalCost).toFixed(2)}</h3>
                </div>
                <div className="callout callout-even">
                    <span>Break-even</span>
                    <h3>${parseFloat(breakEvenPrice).toFixed(2)}</h3>
                </div>
            </div>
        </div>
    );
}
