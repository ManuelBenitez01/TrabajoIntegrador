import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CardDetails.css';

const CardDetails = () => {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allCards, setAllCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCardDetails = async () => {
      const apiUrl = `https://api.pokemontcg.io/v2/cards/${cardId}`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok && data.data) {
          setCard(data.data);
        } else {
          setError('Card not found');
        }
      } catch (err) {
        setError('Error fetching card details');
      } finally {
        setLoading(false);
      }
    };

    fetchCardDetails();
  }, [cardId]);

  useEffect(() => {
    if (card) {
      const fetchAllCards = async () => {
        const apiUrl = `https://api.pokemontcg.io/v2/cards?q=name:${card.name}`;

        try {
          const response = await fetch(apiUrl);
          const data = await response.json();

          if (response.ok && data.data) {
            setAllCards(data.data);
          } else {
            setError('Error fetching all cards');
          }
        } catch (err) {
          setError('Error fetching all cards');
        }
      };

      fetchAllCards();
    }
  }, [card]);

  const handleCardClick = (cardId) => {
    navigate(`/card-details/${cardId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="card-details">
      <h2>{card.name}</h2>
      <img src={card.images.large} alt={card.name} />
      <p>{card.flavorText}</p>
      <h3>All Cards of {card.name}</h3>
      <div className="card-gallery">
        {allCards.map((card, index) => (
          <div key={`${card.id}-${index}`} className="card" onClick={() => handleCardClick(card.id)}>
            <img src={card.images.small} alt={card.name} />
            <h3>{card.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardDetails;
