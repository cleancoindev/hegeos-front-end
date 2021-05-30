import React from 'react';
import { Pie } from 'react-chartjs-2';

function PieChart(props) {
    const data = {
        labels: ['Liquidity Provided', 'Net P&L'],
        datasets: [
            {
                label: 'Total USD',
                data: [props.liquidity, props.pnl],
                backgroundColor: ['#199396', '#F26D26'],
                borderColor: ['#199396', '#F26D26'],
                borderWidth: 1,
            },
        ],
    };

    return <Pie data={data} />;
}

export default PieChart;
