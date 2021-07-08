const getCallOptionProfit = (marketPrice, strikePrice, optionSize) => {
  return ((marketPrice - strikePrice) * optionSize) / marketPrice;
};

const getPutOptionProfit = (marketPrice, strikePrice, optionSize) => {
  return ((strikePrice - marketPrice) * optionSize) / marketPrice;
};

const getSettlementFee = (optionSize) => {
  return optionSize * 0.01;
};

const getPutPeriodFee = (optionSize, holdingPeriod, strikePrice, impliedVolRate, marketPrice, discount) => {
  const coeff = discount ? (100-discount) / 100 : 1;
  return (optionSize * Math.sqrt(holdingPeriod) * impliedVolRate * coeff * strikePrice) / marketPrice;
};

const getCallPeriodFee = (optionSize, holdingPeriod, strikePrice, impliedVolRate, marketPrice, discount) => {
  const coeff = discount ? (100-discount) / 100 : 1;
  return (optionSize * Math.sqrt(holdingPeriod) * impliedVolRate * coeff * marketPrice) / strikePrice;
};

const getStrikeFee = (option, marketPrice, strikeRate, optionSize) => {
  if (option === 'PUT' && strikeRate > marketPrice) {
    return ((strikeRate - marketPrice) * optionSize) / marketPrice;
  } else if (option === 'CALL' && strikeRate < marketPrice) {
    return ((marketPrice - strikeRate) * optionSize) / marketPrice;
  } else return 0;
};

const getTotalCost = (
  option,
  optionSize,
  marketPrice,
  strikePrice,
  //strikeRate,
  impliedVolRate,
  holdingPeriod,
  discount,
) => {
  console.log('option:', option);
  console.log('optionSize:', optionSize);
  console.log('marketPrice:', marketPrice);
  console.log('strikePrice:', strikePrice);
  console.log('impliedVolRate:', impliedVolRate);  
  console.log('holdingPeriod:', holdingPeriod);
  console.log('discount: ', discount);
  if (option === 'PUT') {
    const periodFee = getPutPeriodFee(optionSize, holdingPeriod, strikePrice, impliedVolRate, marketPrice, discount);
    const strikeFee = getStrikeFee(option, marketPrice, strikePrice /* strikeRate */, optionSize);
    const settlementFee = getSettlementFee(optionSize);
    const totalFee = (periodFee + strikeFee + settlementFee) * 1.05 * marketPrice; // +5%
    console.log('periodFee:', periodFee);
    console.log('strikeFee:', strikeFee);
    console.log('settlementFee:', settlementFee);
    console.log('totalFee:', totalFee);
    return totalFee;
  } else if (option === 'CALL') {
    const periodFee = getCallPeriodFee(optionSize, holdingPeriod, strikePrice, impliedVolRate, marketPrice, discount);
    const strikeFee = getStrikeFee(option, marketPrice, strikePrice /* strikeRate */, optionSize);
    const settlementFee = getSettlementFee(optionSize);
    const totalFee = (periodFee + strikeFee + settlementFee) * 1.05 * marketPrice; // +5%
    console.log('periodFee:', periodFee);
    console.log('strikeFee:', strikeFee);
    console.log('settlementFee:', settlementFee);
    console.log('totalFee:', totalFee);
    return totalFee;
  }
};

const getBreakEven = (
  option,
  //optionSize,
  marketPrice,
  strikePrice,
  //strikeRate,
  impliedVolRate,
  holdingPeriod,
  discount,
) => {
  if (option === 'CALL') {
    return Math.abs(
      strikePrice +
        getTotalCost(
          option,
          1, //optionSize,
          marketPrice,
          strikePrice,
          //strikeRate,
          impliedVolRate,
          holdingPeriod,
          discount,
        ),
    );
  } else if (option === 'PUT') {
    return Math.abs(
      strikePrice -
        getTotalCost(
          option,
          1, //optionSize,
          marketPrice,
          strikePrice,
          //strikeRate,
          impliedVolRate,
          holdingPeriod,
          discount,
        ),
    );
  }
};

const TradingOptions = {
  getCallOptionProfit,
  getPutOptionProfit,
  getSettlementFee,
  getCallPeriodFee,
  getPutPeriodFee,
  getTotalCost,
  getBreakEven,
};

export default TradingOptions;
