import React from 'react';
import { useSpring, animated } from 'react-spring';

export default function HoldingPeriodMessage({ option, holdingPeriod, strikePrice, breakEvenPrice }) {
    const divDescription = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });

    let days = [];
    days[1] = '1 day';
    days[7] = '7 days (1 week)';
    days[14] = '14 days (2 weeks)';
    days[21] = '21 days (3 weeks)';
    days[28] = '28 days (4 weeks)';

    if (option === 'PUT') {
        return (
            <animated.div style={divDescription}>
                <div>
                    <p>
                        If the price of underlying asset will rise higher than {breakEvenPrice} during 
                        the next {days[holdingPeriod]} your option will expire worthless. If the 
                        price of underlying asset will fall down lower than {breakEvenPrice} during the 
                        next {days[holdingPeriod]} you will be able to exercise your option and take profits.
                    </p>
                </div>
            </animated.div>
        );
    } else if (option === 'CALL') {
        return (
            <animated.div style={divDescription}>
                <div>
                    <p>
                        If the price of underlying asset will fall down lower than {breakEvenPrice} during 
                        the next {days[holdingPeriod]} your option will expire worthless. If the 
                        price of underlying asset will rise higher than {breakEvenPrice} during the 
                        next {days[holdingPeriod]} you will be able to exercise your option and take profits.
                    </p>
                </div>
            </animated.div>
        );
    }
}
