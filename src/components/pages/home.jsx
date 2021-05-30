import React from 'react';
import TradeOption from '../tradeOption';

function Home(props) {
    return (
        <TradeOption
            mode="home"
            isLoggedIn={props.isLoggedIn}
            onAttachWallet={props.onAttachWallet}
            onDisconnectWallet={props.onDisconnectWallet}
        />
    );
}

export default Home;
