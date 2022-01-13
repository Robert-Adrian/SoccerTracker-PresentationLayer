import React from 'react';
import { Chart } from 'primereact/chart';

function Graph(props) {
    const { graphData } = props;

    let options = {
        legend: {
            labels: {
                fontColor: '#E0EFEF'
            }
        },
        scales: {
            xAxes: [{
                ticks: {
                    fontColor: '#E0EFEF'
                },
                gridLines: {
                    color: '#E0EFEF'
                }
            }],
            yAxes: [{
                ticks: {
                    fontColor: '#E0EFEF'
                },
                gridLines: {
                    color: '#E0EFEF'
                }
            }]
        }
    };

    return (
        <div className='graph'>
            <Chart type="line" data={graphData} options={options} />
        </div>
    );
}

export default Graph;