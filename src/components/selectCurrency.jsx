import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Currency from '../api/Currency';

const pjson = require('../../package.json');

function SelectCurrency(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button variant={props.variant || 'primary'} onClick={handleShow}>
                Exercise
            </Button>

            <Modal show={show} onHide={handleClose} dialogClassName="w-100">
                <div
                    className="text-dark"
                    style={{ backgroundColor: '#074c61', textAlign: 'center', padding: '20px', color: '#fff' }}
                >
                    <h2 style={{ color: '#92cfbb' }}>HOW DO YOU WANT TO RECEIVE YOUR PROFIT?</h2>
                    <div>
                        {Currency.getCurrency().map((currency) => (
                            <a
                                className="btn btn-primary w-25 rounded-0 "
                                onClick={() => {
                                    props.onSelectCurrency(currency);
                                    handleClose();
                                }}
                            >
                                <div className="text-center">
                                    <img
                                        src={pjson.homepage + '/' + currency.icon}
                                        alt={currency.image}
                                        className="w-25"
                                        style={{ height: '100px' }}
                                    />
                                    <br />
                                    <h3 className="pt-3">{currency.type}</h3>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default SelectCurrency;
