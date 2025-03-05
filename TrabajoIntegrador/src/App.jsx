import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './Componentes/Header/Header'
import Main from './Componentes/Mainx/Main'
import Pokemon from './Componentes/Pokemon/Pokemon'
import React from 'react'
import { PokemonProvider } from './Componentes/PokemonContext/PokemonContext'

function App() {
  return (
    <PokemonProvider> 
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/Pokemon/:name" element={<Pokemon />} />
        </Routes>
      </Router>
    </PokemonProvider>
  )
}

export default App
