import React, { createContext, useState, useEffect } from "react";

const PokemonContext = createContext();

export const PokemonProvider = ({ children }) => {
    const [data, setData] = useState([]);
    const [offset, setOffset] = useState(0);
    const [selectedType, setSelectedType] = useState(null);
    const [types, setTypes] = useState([]);
    const [backgroundColor, setBackgroundColor] = useState("#fff");
    const [showTypes, setShowTypes] = useState(false);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState(null);
    const limit = 20;

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/type")
            .then((res) => res.json())
            .then((data) => setTypes(data.results.map((t) => t.name)));
    }, []);

    const callApi = async (type = null, reset = false) => {
        let API_URL;
        if (reset) setData([]);
        if (type) {
            API_URL = `https://pokeapi.co/api/v2/type/${type}`;
            let response = await fetch(API_URL);
            let typeData = await response.json();
            const detailedPokemon = await Promise.all(
                typeData.pokemon.slice(0, 100).map(async (p) => {
                    let res = await fetch(p.pokemon.url);
                    let data = await res.json();
                    return {
                        name: data.name,
                        id: data.id,
                        img: data.sprites.front_default,
                        types: data.types.map((t) => t.type.name),
                    };
                })
            );
            setData(detailedPokemon);
        } else {
            API_URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
            let response = await fetch(API_URL);
            let previousData = await response.json();
            const detailedPokemon = await Promise.all(
                previousData.results.map(async (pokemon) => {
                    let res = await fetch(pokemon.url);
                    let data = await res.json();
                    return {
                        name: pokemon.name,
                        id: data.id,
                        img: data.sprites.front_default,
                        types: data.types.map((type) => type.type.name),
                    };
                })
            );
            setData((prevData) => (reset ? detailedPokemon : [...prevData, ...detailedPokemon]));
        }
    };

    useEffect(() => {
        callApi(null);
    }, [offset]);

    const loadMore = () => {
        setOffset((prevOffset) => prevOffset + limit);
    };

    const handleTypeSelection = (type) => {
        setSelectedType(type);
        setOffset(0);
        callApi(type, true);
    };

    const toggleTypes = () => {
        setShowTypes((prev) => !prev);
    };

    const fetchPokemonDetail = async (name) => {
        setLoading(true);
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const data = await response.json();

            const speciesResponse = await fetch(data.species.url);
            const speciesData = await speciesResponse.json();
            const evolutionResponse = await fetch(speciesData.evolution_chain.url);
            const evolutionData = await evolutionResponse.json();

            const evolutions = [];
            let evoChain = evolutionData.chain;
            do {
                evolutions.push({
                    name: evoChain.species.name,
                    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evoChain.species.url.split("/")[6]}.png`
                });
                evoChain = evoChain.evolves_to[0];
            } while (evoChain);

            setSelectedPokemon({ data, evolutions });
        } catch (error) {
            console.error("Error al obtener detalles del Pokémon:", error);
        } finally {
            setLoading(false);
        }
    };

    
    const searchPokemon = async (query) => {
        if (!query) {
            setSearchResult(null);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`);
            if (!response.ok) {
                setSearchResult(null);
                return;
            }
            const data = await response.json();
            setSearchResult({
                name: data.name,
                id: data.id,
                img: data.sprites.front_default,
                types: data.types.map((t) => t.type.name),
            });
        } catch (error) {
            console.error("Error al buscar Pokémon:", error);
            setSearchResult(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PokemonContext.Provider
            value={{
                data,
                loadMore,
                handleTypeSelection,
                types,
                backgroundColor,
                showTypes,
                toggleTypes,
                fetchPokemonDetail,
                selectedPokemon,
                loading,
                searchPokemon, 
                searchResult,
            }}
        >
            {children}
        </PokemonContext.Provider>
    );
};

export default PokemonContext;
