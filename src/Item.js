import React from 'react';

const Item = ({name, age, address, team, createdAt, updatedAt}) => {

    if (!name) {
        return (<div>Select user...</div>);
    }

    return (
        <div>
            <ul>
                <li><strong>Name:</strong> {name}</li>
                <li><strong>Age:</strong> {age}</li>
                <li><strong>Address:</strong> {address}</li>
                <li><strong>Team:</strong> {team}</li>
                <li><strong>Created At:</strong> {createdAt}</li>
                <li><strong>Updated At:</strong> {updatedAt}</li>
            </ul>
        </div>
    );
};

export default Item;