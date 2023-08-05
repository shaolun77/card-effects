import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Card from './Card';

const API_BASE_URL = 'https://deckofcardsapi.com/api/deck';

const CardDeck = () => {
    const [deck, setDeck] = useState(null);
    const [cardImage, setCardImage] = useState(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const drawInterval = useRef(null);
    const isDeckEmpty = useRef(false); // Create a ref for the deck empty flag

    const fetchData = async () => {
        const response = await axios.get(`${API_BASE_URL}/new/shuffle/?deck_count=1`);
        setDeck(response.data);
        isDeckEmpty.current = false; // Reset the deck empty flag when fetching a new deck
    }

    useEffect(() => {
        fetchData();
    }, []);

    const getCard = async () => {
        if (isDeckEmpty.current) {
            return; // If deck is empty, stop execution of the function
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/${deck.deck_id}/draw/?count=1`);

            if (response.data.remaining === 0) {
                clearInterval(drawInterval.current);
                setIsDrawing(false);
                isDeckEmpty.current = true; // Set the deck empty flag to true
                alert("Error: no cards remaining!");
                return;
            }

            setCardImage(response.data.cards[0].image);
        } catch (err) {
            console.log(err);
        }
    }

    const toggleDrawing = () => {
        if (isDrawing) {
            clearInterval(drawInterval.current);
        } else {
            drawInterval.current = setInterval(() => getCard(), 1000);
        }
        setIsDrawing(!isDrawing);
    }

    const shuffleDeck = async () => {
        clearInterval(drawInterval.current);
        setIsDrawing(false);
        await fetchData();
    }

    return (
        <div>
            {deck ?
                <div>
                    <button onClick={toggleDrawing}>{isDrawing ? "Stop drawing" : "Start drawing"}</button>
                    <button onClick={shuffleDeck}>Shuffle deck</button>
                </div>
                : <div>Loading...</div>}
            <Card image={cardImage} />
        </div>
    );
}

export default CardDeck;
