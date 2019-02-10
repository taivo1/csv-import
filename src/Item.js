import React from 'react';

const Item = ({name, age, address, team, createdAt, updatedAt}) => {

    if (!name) {
        return '';
    }

    return (
        <ul className="list-reset">
            <li className="py1"><h2>{name}</h2></li>
            <li className="py1"><strong>Age:</strong> {age}</li>
            <li className="py1"><strong>Address:</strong> {address}</li>
            <li className="py1"><strong>Team:</strong> {team}</li>
            <li className="py1"><strong>Created At:</strong> {createdAt}</li>
            <li className="py1"><strong>Updated At:</strong> {updatedAt}</li>
        </ul>
    );
};

export default Item;