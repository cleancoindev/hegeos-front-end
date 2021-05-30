import _ from 'lodash';

const contracts = [
  {
    crypto: 'USD',
    optionType: 'CALL',
    optionSize: 1,
    strikePrice: 201,
    priceNow: 205,
    breakEven: 25,
    placedAt: '2021-04-23T18:25:43.511Z',
    expiresAt: '2021-04-23T18:25:43.511Z',
    expiresIn: '2021-04-23T18:25:43.511Z',
    exercise: 20,
    share: 10,
    plRealized: 30,
    status: 'finished',
  },
  {
    crypto: 'USD',
    optionType: 'CALL',
    optionSize: 1,
    strikePrice: 201,
    priceNow: 205,
    breakEven: 25,
    placedAt: '2021-04-23T18:25:43.511Z',
    expiresAt: '2021-04-23T18:25:43.511Z',
    expiresIn: '2021-04-23T18:25:43.511Z',
    exercise: 20,
    share: 10,
    plRealized: 30,
    status: 'active',
  },
  {
    crypto: 'USD',
    optionType: 'CALL',
    optionSize: 1,
    strikePrice: 201,
    priceNow: 212,
    breakEven: 24,
    placedAt: '2021-03-23T18:25:43.511Z',
    expiresAt: '2021-03-23T18:25:43.511Z',
    expiresIn: '2021-03-23T18:25:43.511Z',
    exercise: 20,
    share: 10,
    plRealized: 30,
    status: 'active',
  },
  {
    crypto: 'USD',
    optionType: 'PUT',
    optionSize: 1,
    strikePrice: 201,
    priceNow: 225,
    breakEven: 15,
    placedAt: '2021-02-23T18:25:43.511Z',
    expiresAt: '2021-02-23T18:25:43.511Z',
    expiresIn: '2021-02-23T18:25:43.511Z',
    exercise: 20,
    share: 10,
    plRealized: 30,
    status: 'pending',
  },
];

const getContractHistory = () => {
  return _.filter(contracts, function (c) {
    return !c.status === 'pending';
  });
};
const getActiveContracts = () => {
  return _.filter(contracts, function (c) {
    return c.status === 'active';
  });
};
const getPendingContracts = () => {
  return _.filter(contracts, function (c) {
    return c.status === 'pending';
  });
};

const addContract = (formData) => {
  console.log('HEREEEE');
  return alert(JSON.stringify(formData));
};

const Contracts = {
  getContractHistory,
  getActiveContracts,
  getPendingContracts,
  addContract,
};

export default Contracts;
