import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cartas.css';

const Cartas = () => {
  const [pokemonCards, setPokemonCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [rarityFilter, setRarityFilter] = useState('');
  const navigate = useNavigate();
  
  const fetchCards = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = [];
      if (searchTerm) query.push(`name:"${searchTerm}"`);
      if (typeFilter) query.push(`types:${typeFilter}`);
      
      let formattedRarity = rarityFilter;
      if (rarityFilter === "Secret Rare") {
        formattedRarity = '"Secret Rare"';
      } else if (rarityFilter) {
        formattedRarity = `"${rarityFilter}"`;
      }

      if (formattedRarity) query.push(`rarity:${formattedRarity}`);

      let apiUrl = `https://api.pokemontcg.io/v2/cards?page=${page}&pageSize=20`;
      if (query.length > 0) {
        apiUrl += `&q=${query.join(" ")}`;
      }

      console.log("Fetching:", apiUrl);
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (response.ok && data.data) {
        setPokemonCards(data.data);
      } else {
        setError('No se encontraron cartas o se superó el límite de la API');
      }
    } catch (err) {
      setError('Error al obtener los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [page, searchTerm, typeFilter, rarityFilter]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => (prev > 1 ? prev - 1 : prev));

  const handleCardClick = (cardId) => navigate(`/card-details/${cardId}`);

  
  const handleTypeChange = (e) => {
    setPage(1);
    setTypeFilter(e.target.value);
  };

  const handleRarityChange = (e) => {
    setPage(1);
    setRarityFilter(e.target.value);
  };

  return (
    <div>
      <h2>Cartas de Pokémon</h2>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={handleTypeChange} value={typeFilter}>
          <option value="">Filtrar por tipo</option>
          {['Grass', 'Fire', 'Water', 'Lightning', 'Psychic', 'Fighting', 'Darkness', 'Metal', 'Dragon', 'Fairy'].map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select onChange={handleRarityChange} value={rarityFilter}>
          <option value="">Filtrar por rareza</option>
          {['Common', 'Uncommon', 'Rare', 'Rare Holo', 'Ultra Rare', 'Secret Rare'].map(rarity => (
            <option key={rarity} value={rarity}>{rarity}</option>
          ))}
        </select>
      </div>
      
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      
      <div className="card-gallery">
        {pokemonCards.map((card) => (
          <div key={card.id} className="card" onClick={() => handleCardClick(card.id)}>
            <img src={card.images.small} alt={card.name} />
            <h3>{card.name}</h3>
          </div>
        ))}
      </div>
      
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={page === 1}>Anterior</button>
        <span>Página {page}</span>
        <button onClick={handleNextPage}>Siguiente</button>
      </div>
    </div>
  );
};

export default Cartas;