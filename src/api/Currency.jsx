const currency = [
    {
        type: 'DAI',
        icon: 'images/currency/dai.svg',
    },
    {
        type: 'EOS',
        icon: 'images/currency/eos.svg',
    },
    {
        type: 'USDC',
        icon: 'images/currency/usdc.svg',
    },
];

const getCurrency = () => {
    return currency;
};

const setCurrency = (type) => {
    const selectedCurrency = currency.filter((curr) => curr.type === type);
    console.log('Currency function can be set here');
    return selectedCurrency[0] ? selectedCurrency[0] : null;
};

const Currency = {
    getCurrency,
    setCurrency,
};

export default Currency;
