import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './Componentes/Header/Header'
import Main from './Componentes/Mainx/Main'
import Pokemon from './Componentes/Pokemon/Pokemon'
import React from 'react'
import { PokemonProvider } from './Componentes/PokemonContext/PokemonContext'
import Cartas from './Componentes/Cartas/Cartas'
import CardDetails from './Componentes/Cartas/CardDetails'
import Footer from './Componentes/Footer/Footer'


function App() {
  return (
    <PokemonProvider> 
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/Pokemon/:name" element={<Pokemon />} />
          <Route path="/Cartas" element={<Cartas />} />
          <Route path="/card-details/:cardId" element={<CardDetails />} />
        </Routes>
        <Footer/>
      </Router>
    </PokemonProvider>
  )
}

export default App
