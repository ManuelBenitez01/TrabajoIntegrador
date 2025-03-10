import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CardDetails.css';

const CardDetails = () => {
  const { cardId } = useParams();
  const [cardDetails, setCardDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        const response = await fetch(`https://api.pokemontcg.io/v2/cards/${cardId}`);
        const data = await response.json();
        if (response.ok) {
          setCardDetails(data.data);
        } else {
          setError('Error fetching card details');
        }
      } catch (err) {
        setError('Error fetching card details');
      } finally {
        setLoading(false);
      }
    };

    fetchCardDetails();
  }, [cardId]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <article>
    <div className="card-details">
      {cardDetails && (
        <>
          <h2>{cardDetails.name}</h2>
          <img src={cardDetails.images.large} alt={cardDetails.name} />
          <p><strong>Precio: $</strong> {cardDetails.cardmarket?.prices?.averageSellPrice || 'N/A'}</p>
          <p><strong>Autor:</strong> {cardDetails.artist || 'N/A'}</p>
          <p><strong>Fecha de creación:</strong> {cardDetails.set.releaseDate || 'N/A'}</p>
          <p><strong>Tipo:</strong> {cardDetails.types?.join(', ') || 'N/A'}</p>
          <p><strong>Rareza:</strong> {cardDetails.rarity || 'N/A'}</p>
          <p><strong>Descripción:</strong> {cardDetails.flavorText || 'N/A'}</p>
        </>
      )}
    </div>
    </article>
  );
};

export default CardDetails;
