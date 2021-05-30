import React from 'react';
import TradeOption from '../tradeOption';

function Holders(props) {
    return (
        <TradeOption
            mode="holders"
            isLoggedIn={props.isLoggedIn}
            onAttachWallet={props.onAttachWallet}
            onDisconnectWallet={props.onDisconnectWallet}
        />
    );
}

export default Holders;
