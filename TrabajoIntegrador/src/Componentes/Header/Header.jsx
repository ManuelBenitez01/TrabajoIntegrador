import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import PokemonContext from "../PokemonContext/PokemonContext";
import { TbPokeball, TbAlignJustified } from "react-icons/tb";
import "./Header.css";

export default function Header() {
    const { toggleTypes, searchPokemon, searchResult } = useContext(PokemonContext);
    const [query, setQuery] = useState("");
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(prevMode => !prevMode);
    const onSearchChange = (e) => setQuery(e.target.value);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (query.trim()) {
            await searchPokemon(query);
            if (searchResult) {
                navigate(`/pokemon/${query.toLowerCase()}`);
                setQuery("");
                setMenuOpen(false); 
            }
        }
    };

    const handleTypesClick = (e) => {
        e.preventDefault();
        toggleTypes();
        setMenuOpen(false); 
    };

    return (
        <header>
            <nav>
                <TbAlignJustified className="menu-icon" onClick={() => setMenuOpen(!menuOpen)} />
                <img src="./Logopoke.svg" alt="Logo Pokémon" className="logo" onClick={() => {navigate("/"); window.location.reload();}}/>
                <div className={`menu ${menuOpen ? "open" : ""}`}>
                    <form onSubmit={handleSearch}>
                        <label htmlFor="Buscador"className="label" onClick={() => {navigate("/"); window.location.reload();}}>Buscamon</label>
                        <input type="search" name="Search" value={query} onChange={onSearchChange} />
                        <button type="submit">Buscar</button>
                    </form>
                    <ul className="menu-list">
                        <li>
                            <Link to="/cartas" onClick={() => setMenuOpen(false)}>Cartas Pokemon</Link>
                            <a href="#" onClick={handleTypesClick}>Tipos</a>
                            <TbPokeball className="pokebola" onClick={toggleDarkMode} />
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}