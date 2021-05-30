/*
    Example of the crypto currency supported on the trade
    change this to the API
*/
let cryptoCurrencies = [
    {
        currency: 'USDC',
        marketPrice: 6.25999999999999979,
        //strikeRate: 6.25999999999999979,
        utilizationRate: 0,
        availabilityMin: 0,
        availabilityMax: 0,
    },
    {
        currency: 'DAI',
        marketPrice: 6.25999999999999979,
        //strikeRate: 6.25999999999999979,
        utilizationRate: 0,
        availabilityMin: 0,
        availabilityMax: 0,
    },
];

/*
    will just going to pull up the crypto currency supported on the API
*/
const getCryptoCurrencies = () => {
    return cryptoCurrencies;
};

/*
    will get the exact crypto currency you want to trade on.
*/
const getCryptoCurrency = (currency) => {
    const i = cryptoCurrencies.findIndex(crypto => crypto.currency === currency);
    return i !== -1 ? cryptoCurrencies[i] : null;
};

const setMarketPrice = (currency, price) => {
    const i = cryptoCurrencies.findIndex(crypto => crypto.currency === currency);
    if (i !== -1) {
        cryptoCurrencies[i].marketPrice = price;
        //cryptoCurrencies[i].strikeRate = Number(price.toFixed(2));
    }
}

const Crypto = {
    getCryptoCurrencies,
    getCryptoCurrency,
    setMarketPrice,
};

export default Crypto;
