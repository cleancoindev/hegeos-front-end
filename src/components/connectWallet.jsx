import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Wallet from '../api/Wallets';

function ConnectWallet(props) {
    //const [show, setShow] = useState(false);

    //const handleClose = () => setShow(false);
    //const handleShow = () => setShow(true);

    return (
        <>
            {!props.isLoggedIn() ? (
                <Button variant={props.variant || 'primary'} onClick={props.onAttachWallet /* handleShow */}>
                    Connect your wallet
                </Button>
            ) : (
                <Button variant={props.variant || 'primary'} onClick={props.onDisconnectWallet}>
                    Disconnect {props.wallet}
                </Button>
            )}
            { /* (
            <Modal show={show} onHide={handleClose} dialogClassName="w-25">
                <div className="text-dark">
                    <div className="row">
                        {Wallet.getWallet().map((wallet) => (
                            <a
                                className="btn btn-primary w-100 rounded-0 "
                                onClick={() => {
                                    props.onAttachWallet(wallet);
                                    handleClose();
                                }}
                            >
                                <div className="text-center">
                                    <img
                                        src={'/' + wallet.image}
                                        alt={wallet.image}
                                        className="w-25"
                                    />
                                    <br />
                                    <h3 className="pt-3">{wallet.walletName}</h3>
                                    {wallet.description}
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </Modal>
            ) */ }
        </>
    );
}

export default ConnectWallet;
