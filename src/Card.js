import React from 'react';

const Card = ({ image }) => {
    return (
        <div>
            {image && <img src={image} alt="Card" />}
        </div>
    );
}

export default Card;