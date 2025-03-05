import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PokemonContext from "../PokemonContext/PokemonContext";
import "./Main.css";

const typeColors = {
    fire: ["#FF4422", "#FF8844", "#FFCC55"],
    water: ["#3399FF", "#33CCFF", "#99DDFF"],
    grass: ["#77CC55", "#99DD77", "#BBFF99"],
    electric: ["#FFCC33", "#FFD700", "#FFEA70"],
    normal: ["#A8A77A", "#C6C6A7", "#E0E0D1"],
    flying: ["#A98FF3", "#C6B7F5", "#E0C3F8"],
    fighting: ["#C22E28", "#E06B64", "#F19C95"],
    poison: ["#A33EA1", "#C878C8", "#E3A1E3"],
    ground: ["#E2BF65", "#F0DDA3", "#FAF1D6"],
    rock: ["#B6A136", "#D1C07E", "#EAE2BA"],
    bug: ["#A6B91A", "#C7D65C", "#E6F08E"],
    ghost: ["#735797", "#9573B5", "#B79CCF"],
    steel: ["#B7B7CE", "#D1D1E0", "#EAEAF8"],
    psychic: ["#F95587", "#FB88AA", "#FCA5BF"],
    ice: ["#96D9D6", "#B8E7E4", "#D9F6F4"],
    dragon: ["#6F35FC", "#9270F5", "#B39AF7"],
    dark: ["#705746", "#8B6B5C", "#A48174"],
    fairy: ["#D685AD", "#E8A8C6", "#FAD0E0"]
};

export default function Main() {
    const { data, loadMore, handleTypeSelection, selectedType, showTypes } = useContext(PokemonContext);
    const [backgroundColor, setBackgroundColor] = useState("#fff");

    useEffect(() => {
        if (selectedType) {
            setBackgroundColor(typeColors[selectedType]?.[1] || "#f8f9fa");
        } else {
            setBackgroundColor("#f8f9fa");
        }
    }, [selectedType]);

    return (
        <main className="container" style={{ backgroundColor }}>
            <aside className={`aside-tipos ${showTypes ? "visible" : ""}`}>
                <h2>Filtrar por tipo</h2>
                <button onClick={() => handleTypeSelection(null)}>Todos</button>
                {Object.keys(typeColors).map((type) => (
                    <button key={type} onClick={() => handleTypeSelection(type)} style={{ backgroundColor: typeColors[type][1] }}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </aside>
            <section className="card-grid">
    {data.map((pokemon) => {
        const pokemonTypes = pokemon.types.map(type => type.toLowerCase());
        const colors = pokemonTypes.map(type => typeColors[type]?.[1] || "#ccc");

        
        const background = colors.length > 1
            ? `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`
            : colors[0];

        return (
            <div key={pokemon.name} className="pokemon-card" style={{ background }}>
                <p className="card-id">#{pokemon.id}</p>
                <img src={pokemon.img} alt={pokemon.name} className="card-image"/>
                <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemon.id}.gif`} className="card-image1" alt={pokemon.name} />

                <h1 className="card-title">{pokemon.name}</h1>
                <p className="card-types">{pokemon.types.join(", ")}</p>
                <Link to={`/pokemon/${pokemon.name}`} className="card-link">Ver más</Link>
            </div>
        );
    })}
</section>
            <button onClick={loadMore} className="cargarmas">Cargar más Pokémon</button>
        </main>
    );
}
