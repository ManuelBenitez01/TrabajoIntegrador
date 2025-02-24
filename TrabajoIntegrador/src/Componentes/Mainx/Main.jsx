import './Main.css';
import React from 'react';
import { useState, useEffect } from 'react';

export default function Main() {

    const [data, setData] = useState();
    let offset = 0;
    let vermas = 1000;
    const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit='+vermas+'&offset='+ offset; 

  let callApi = async () => {
    let response = await fetch(API_URL);
    let PreviousData = await response.json();
    setData(PreviousData);
    console.log(PreviousData);
  };
  useEffect(() => {
    callApi()
    }, []);

    
    return(
      <>
        
       
       <main>
        <aside>
          
        </aside>
        <section>
        {data && data.results.map((pokemon,i) => {
          
          let pokemonid = offset +1 +i;
          let img = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + pokemonid + '.png'
          
          return (
            <div key={pokemon.name}>
              <p>{pokemonid}</p>
              <p>{}</p>
              <img src={img} alt="" />
              <h1>{pokemon.name}</h1>
              
              <a href="">Ver mas</a>
            </div>
          );
        })}
        </section>
       </main>
      
        

        
        
        
      </>
    )
} 
