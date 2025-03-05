import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PokemonContext from "../PokemonContext/PokemonContext";
import "./Pokemon.css";

const typeColors = {
    fire: ["#FF4422", "#FF8844", "#FFCC55"],
    water: ["#3399FF", "#33CCFF", "#99DDFF"],
    grass: ["#77CC55", "#99DD77", "#BBFF99"],
    electric: ["#FFCC33", "#FFD700", "#FFEA70"],
};

export default function PokemonDetail() {
    const { name } = useParams();
    const navigate = useNavigate();
    const { fetchPokemonDetail, selectedPokemon, loading } = useContext(PokemonContext);
    const [cardImage, setCardImage] = useState(null);
    const [description, setDescription] = useState(""); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pokemonCards, setPokemonCards] = useState([]);

    useEffect(() => {
        fetchPokemonDetail(name);

        fetch(`https://api.pokemontcg.io/v2/cards?q=name:${name.toLowerCase()}`)
            .then(response => response.json())
            .then(data => {
                if (data.data && data.data.length > 0) {
                    const bestCard = data.data.find(card => card.images.large) || data.data[0];
                    setCardImage(bestCard.images.large);
                }
            })
            .catch(error => console.error("Error al obtener la carta TCG:", error));

        fetch(`https://pokeapi.co/api/v2/pokemon-species/${name.toLowerCase()}`)
            .then(response => response.json())
            .then(data => {
                const flavorTextEntry = data.flavor_text_entries.find(entry => entry.language.name === "es")
                    || data.flavor_text_entries.find(entry => entry.language.name === "en"); 

                setDescription(flavorTextEntry ? flavorTextEntry.flavor_text.replace(/\n|\f/g, " ") : "Descripción no disponible.");
            })
            .catch(error => console.error("Error al obtener la descripción:", error));

    }, [name]);

    const fetchPokemonCards = () => {
        fetch(`https://api.pokemontcg.io/v2/cards?q=name:${name.toLowerCase()}`)
            .then(response => response.json())
            .then(data => {
                if (data.data && data.data.length > 0) {
                    setPokemonCards(data.data);
                    setIsModalOpen(true);
                }
            })
            .catch(error => console.error("Error al obtener las cartas TCG:", error));
    };

    if (loading) return <h2>Cargando...</h2>;
    if (!selectedPokemon) return <h2>No se encontró el Pokémon</h2>;

    const { data: pokemon, evolutions } = selectedPokemon;

    const getBackgroundStyle = (types) => {
        const colors = types.flatMap(type => typeColors[type] || ["#A8A77A", "#C6C6A7", "#E0E0D1"]);
        return { background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})` };
    };

    return (
        <div className="pokemon-detail" style={getBackgroundStyle(pokemon.types.map(t => t.type.name))}>
            <div>
                <h1>{pokemon.name.toUpperCase()}</h1>
                <img className="pokemonimg" src={pokemon.sprites.other["official-artwork"].front_default} alt={pokemon.name} />
                
                <p className="pokemon-description">{description}</p>

                {cardImage ? (
                    <div className="pokemon-card-container">
                        <h3>Carta TCG:</h3>
                        <img
                            className="pokemon-card1"
                            src={cardImage}
                            alt={`${pokemon.name} TCG Card`}
                            onClick={fetchPokemonCards}
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                ) : (
                    <p>No hay una carta TCG disponible.</p>
                )}
            </div>
            
            <div className="pokemon">
                <h3>Habilidades:</h3>
                <ul>
                    {pokemon.abilities.map((ability, index) => (
                        <li key={index}>{ability.ability.name}</li>
                    ))}
                </ul>

                <h3>Tipos:</h3>
                <ul>
                    {pokemon.types.map((type, index) => (
                        <li key={index}>{type.type.name}</li>
                    ))}
                </ul>
                <h3>Estadísticas Base:</h3>
                <ul>
                    {pokemon.stats.map((stat, index) => (
                        <li key={index}>{stat.stat.name}: {stat.base_stat}</li>
                    ))}
                </ul>
                <h3>Movimientos:</h3>
                <ul>
                    {pokemon.moves.slice(0, 5).map((move, index) => (
                        <li key={index}>{move.move.name}</li>
                    ))}
                </ul>
                <h3>Sprites:</h3>
                <div className="sprite-container">
                    <img src={pokemon.sprites.front_default} alt="Normal" />
                    <img src={pokemon.sprites.front_shiny} alt="Shiny" />
                </div>
                {pokemon.gender_rate !== undefined && (
                    <div>
                        <h3>Ratio de Género:</h3>
                        <p>{pokemon.gender_rate === -1 ? "Sin género" : `Macho: ${100 - pokemon.gender_rate * 12.5}%, Hembra: ${pokemon.gender_rate * 12.5}%`}</p>
                    </div>
                )}

                <h3>Altura:</h3>
                <p>{pokemon.height}</p>
                <h3>Peso:</h3>
                <p>{pokemon.weight}</p>
            </div>
            <div>
                <h3>debilidades</h3>
                <ul>
                    
                </ul>
            </div>
            
            <div className="Evolucion">
                <h3>Evoluciones:</h3>
                {evolutions.length > 0 ? (
                    evolutions.map((evo, index) => (
                        <div key={index} className="evolution-card">
                            <p>{evo.name}</p>
                            <img src={evo.image} alt={evo.name} />
                        </div>
                    ))
                ) : (
                    <p>Este Pokémon no tiene evoluciones.</p>
                )}
            </div>

            <button onClick={() => navigate(-1)} className="back-button">Volver atrás</button>

            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Cartas de {pokemon.name}</h2>
                        <div className="card-gallery">
                            {pokemonCards.map((card, index) => (
                                <img key={index} src={card.images.large} alt={`Carta ${pokemon.name}`} />
                            ))}
                        </div>
                        <button onClick={() => setIsModalOpen(false)}>Cerrar</button>
                    </div>
                </div>
            )}
        </div>
    );
}