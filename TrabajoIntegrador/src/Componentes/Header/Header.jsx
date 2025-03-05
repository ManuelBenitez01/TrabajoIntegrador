import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PokemonContext from "../PokemonContext/PokemonContext";
import { TbPokeball } from "react-icons/tb";
import "./Header.css";

export default function Header() {
    const { toggleTypes, searchPokemon, searchResult } = useContext(PokemonContext);
    const [query, setQuery] = useState("");
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true"; 
    });
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };

    const onSearchChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (query.trim()) {
            await searchPokemon(query);
            if (searchResult) {
                navigate(`/pokemon/${query.toLowerCase()}`);
                setQuery(""); 
            }
        }
    };

    return (
        <header>
            <nav>
                <form onSubmit={handleSearch}>
                    <label htmlFor="Buscador" className="label">Buscamon</label>
                    <input 
                        type="search" 
                        name="Search" 
                        value={query} 
                        onChange={onSearchChange} 
                    />
                    <button type="submit">Buscar</button>
                </form>
            </nav>
            
            <img 
                src="./Logopoke.svg" 
                alt="Logo Pokémon" 
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
            />
            
            <ul>
                <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); toggleTypes(); }}>
                        Tipos
                    </a>
                </li>
                <li>
                    <TbPokeball 
                        className="pokebola" 
                        onClick={toggleDarkMode}
                    />
                </li>
            </ul>
        </header>
    );
}