import React, { useState, useEffect } from 'react';
import './App.css';

function ExpandedCard({ pokemon, onClose }) {
  return (
    <div className="expanded-card">
      <div className="expanded-card-content">
        <span className="close" onClick={onClose}>X</span>
        <h2>{pokemon.name}</h2>
        <img className="img-expanded-card" src={pokemon.imageUrl} alt={pokemon.name} />
        <p>Types: {pokemon.types.join(', ')}</p>
        <p>Attack: {pokemon.attack}</p>
        <p>Defense: {pokemon.defense}</p>
        <p>Speed: {pokemon.speed}</p>
      </div>
    </div>
  );
}

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      setLoading(true);
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      const data = await response.json();

      const pokemonList = await Promise.all(
        data.results.map(async pokemon => {
          const detailsResponse = await fetch(pokemon.url);
          const detailsData = await detailsResponse.json();

          return {
            id: detailsData.id,
            name: detailsData.name,
            imageUrl: detailsData.sprites.front_default,
            types: detailsData.types.map(type => type.type.name),
            defense: detailsData.stats.find(stat => stat.stat.name === 'defense').base_stat,
            attack: detailsData.stats.find(stat => stat.stat.name === 'attack').base_stat,
            speed: detailsData.stats.find(stat => stat.stat.name === 'speed').base_stat,
          };
        })
      );

      setPokemonData(pokemonList);
      setLoading(false);
    };

    fetchPokemonData();
  }, []);

  const filteredPokemon = pokemonData.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openPopup = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const closePopup = () => {
    setSelectedPokemon(null);
  };

  return (
    <div className="App">
      <h1>Pokédex</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Pokémon"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="pokemon-list">
        {loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="pokemon-skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-details"></div>
              <div className="skeleton-details"></div>
            </div>
          ))
        ) : (
          filteredPokemon.map(pokemon => (
            <div key={pokemon.id} className="pokemon" onClick={() => openPopup(pokemon)}>
              <img src={pokemon.imageUrl} alt={pokemon.name} />
              <div className="pokemon-info">
                <h2>{pokemon.name}</h2>
                <p>Types: {pokemon.types.join(', ')}</p>
                <div className="stat-bar">
                  <span className="stat-label">Attack:</span>
                  <span className="stat-value">{pokemon.attack}</span>
                  <div className="stat-bar-inner">
                    <div
                      className="stat-bar-fill"
                      style={{ width: (pokemon.attack / 2) + '%' }}
                    ></div>
                  </div>
                </div>
                <div className="stat-bar">
                  <span className="stat-label">Defense:</span>
                  <span className="stat-value">{pokemon.defense}</span>
                  <div className="stat-bar-inner">
                    <div
                      className="stat-bar-fill"
                      style={{ width: (pokemon.defense / 2) + '%' }}
                    ></div>
                  </div>
                </div>
                <div className="stat-bar">
                  <span className="stat-label">Speed:</span>
                  <span className="stat-value">{pokemon.speed}</span>
                  <div className="stat-bar-inner">
                    <div
                      className="stat-bar-fill"
                      style={{ width: (pokemon.speed / 2) + '%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {selectedPokemon && <ExpandedCard pokemon={selectedPokemon} onClose={closePopup} />}
    </div>
  );
}

export default App;
