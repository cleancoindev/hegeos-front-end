import React from 'react';
import { Button } from 'react-bootstrap';

const OptionsPagination = ({ optionsPerPage, totalOptions, paginate, showExpired, onShowExpired, currentTime }) => {
    const pageNumbers = [];

    function pad(number, length) {
        let str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }

    function formatCurrentTime() {
        const d = new Date(currentTime);
        let s = d.getFullYear().toString() + '-' +
            pad(d.getMonth() + 1, 2) + '-' +
            pad(d.getDate(), 2) + ' ' +
            pad(d.getHours(), 2) + ':' +
            pad(d.getMinutes(), 2);
        console.log('currentTime: ', s);
        return s;
    }

    for (let i = 1; i <= Math.ceil(totalOptions / optionsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <li key={number} className="page-item">
                        <Button variant="link" onClick={() => paginate(number)} className="page-link">
                            {number}
                        </Button>
                    </li>
                ))}
                <div style={{display: "inline-block", textAlign: "right", width: "100%"}}>
                    <label for="show-expire">
                        <input id="show-expired" type="checkbox" checked={showExpired} onClick={onShowExpired} /> <span onClick={onShowExpired}>Show Expired</span>
                    </label>
                    <br/>
                    <small>{formatCurrentTime()}</small>
                </div>
            </ul>                
        </nav>            
    );
}

export default OptionsPagination;