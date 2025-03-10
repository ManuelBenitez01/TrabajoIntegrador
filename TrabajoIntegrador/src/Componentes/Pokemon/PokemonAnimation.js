import React, { useEffect } from "react";
import "./Pokemon.css";

const PokemonAnimation = () => {
    useEffect(() => {
        const particleContainer = document.createElement("div");
        particleContainer.className = "particle-background";
        document.body.appendChild(particleContainer);

        // Crear partículas dinámicamente
        for (let i = 0; i < 50; i++) {
            let particle = document.createElement("div");
            particle.className = "particle";
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${Math.random() * 100}vh`;
            particle.style.animationDuration = `${2 + Math.random() * 3}s`;
            particleContainer.appendChild(particle);
        }

        return () => {
            document.body.removeChild(particleContainer);
        };
    }, []);

    return (
        <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
            alt="Pokémon corriendo"
            className="running-pokemon"
        />
    );
};

export default PokemonAnimation;