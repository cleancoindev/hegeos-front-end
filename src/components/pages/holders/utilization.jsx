import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';

const rewardsData = [
    { id: 1, type: 'EOS', amount: 30, fee: 3, reward: 34 },
    { id: 2, type: 'DAI', amount: 40, fee: 3, reward: 24 },
    { id: 3, type: 'EOS', amount: 10, fee: 1, reward: 3 },
    { id: 4, type: 'EOS', amount: 32, fee: 3.2, reward: 13 },
];

let utilization = [];

const cryptoTypes = ['ALL', 'EOS', 'DAI'];

utilization['EOS'] = {
    rate: 165000,
    min: 0,
    max: 100,
};
utilization['DAI'] = {
    rate: 165000,
    min: 25,
    max: 100,
};
utilization['ALL'] = {
    rate: utilization['EOS'].rate + utilization['DAI'].rate,
    min: 25,
    max: 100,
};

const claimReward = (id) => {
    alert('claiming ' + id);
};

function Utilization(props) {
    const [key, setKey] = useState('ALL');

    return (
        <div>
            <h2>TRADE DAI & EOS OPTIONS AND EARN {process.env.REACT_APP_HEGEOS_SYMBOL} REWARDS</h2>
            <p>
                Options buyers can claim rewards in {process.env.REACT_APP_HEGEOS_SYMBOL}. After buying DAI or EOS options on {process.env.REACT_APP_HEGEOS_SYMBOL} you will be able
                to claim your rewards. Rewards can be claimed for each option. Reward's size in {process.env.REACT_APP_HEGEOS_SYMBOL} tokens depends on
                the size and period of an option. You will need to manually claim {process.env.REACT_APP_HEGEOS_SYMBOL}.
            </p>
            <div className="row">
                <Tabs id="utilization" activeKey={key} onSelect={(k) => setKey(k)}>
                    {cryptoTypes.map((type) => (
                        <Tab eventKey={type} title={type}>
                            <table className="table table-dark">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Type</th>
                                        <th>Amount</th>
                                        <th>Fee</th>
                                        <th>Reward</th>
                                        <th>Claim</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rewardsData
                                        .filter((d) => d.type === type || type === 'ALL')
                                        .map((data) => (
                                            <tr key={data.id}>
                                                <td>{data.id}</td>
                                                <td>{data.type}</td>
                                                <td>{data.amount}</td>
                                                <td>{data.fee}</td>
                                                <td>{data.reward}</td>
                                                <td>
                                                    <a
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => claimReward(data.id)}
                                                    >
                                                        Claim
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </Tab>
                    ))}
                </Tabs>
            </div>

            <div className="row">
                <div className="col-md-6">
                    Total daily amount :<br />
                    <h3>{utilization[key].rate + ' ' + process.env.REACT_APP_HEGEOS_SYMBOL}</h3>
                </div>
                <div className="col-md-6">
                    Distributed today :<br />
                    <h3>{utilization[key].min + ' / ' + utilization[key].max} {process.env.REACT_APP_HEGEOS_SYMBOL}</h3>
                </div>
                <div className="col-md-12">
                    <div className="progress">
                        <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{ width: utilization[key].min + '%' }}
                            aria-valuenow={utilization[key].rate}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Utilization;
