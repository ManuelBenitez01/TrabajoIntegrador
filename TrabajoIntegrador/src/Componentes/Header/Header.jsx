import './Header.css';
import React from 'react';


export default function Header() {
  return (
    <header>
      <nav>
        <label htmlFor="Buscador" className='label' >Buscamon</label>
        <input type="search" name="Search" id="" />
        <a href="#">Buscar</a>
      </nav>
      <img src="./Logopoke.svg" alt="" />
      <ul>
        <li><a href="">Tipos</a></li>
        <li><a href="">Equipos</a></li>
      </ul>
    </header>
  );
}
