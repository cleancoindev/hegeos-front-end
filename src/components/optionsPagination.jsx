import React from 'react';
import { Button } from 'react-bootstrap';

const OptionsPagination = ({ optionsPerPage, totalOptions, paginate }) => {
    const pageNumbers = [];

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
            </ul>
        </nav>
    );
}

export default OptionsPagination;