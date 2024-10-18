import React, { useState, useEffect } from "react";
import api from './services/api.js';
import './global.css';
import './App.css';
import './sidebar.css';
import './main.css';
// coomponente: função que retorna html e/ou css;
//Estado: informaçõoes mantidas pelo componente;
// propriedade: informações que um coomponente pai para para o comp fiilho




function App() {
  const [devs, setDevs] = useState([]);
  const [techs, setTechs] = useState('');
  const [github_username, setGitHubUsername] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setLatitude(latitude);
        setLongitude(longitude);
      },
      (err) => {
        console.log(err);
      },
      {
        timeout: 30000,
      }
    )
  }, [])

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');

      setDevs(response.data);
    }
    loadDevs();
  }, [])

  async function handleAddDev(e) {
    e.preventDefault();

    const response = await api.post('/devs', {
      github_username,
      techs,
      latitude,
      longitude,
    })
    setGitHubUsername('');
    setTechs('');
    setDevs([...devs, response.data]);
  }


  return (
    <div id="app" >
      <aside>
        <strong>Cadastrar</strong>
        <form onSubmit={handleAddDev}>
          <div className="input-block">
            <label hltmfor="github_username">Usuario do GitHub</label>
            <input
              name="github_username"
              id="github_username"
              required
              value={github_username}
              onChange={e => setGitHubUsername(e.target.value)}
            />
          </div>

          <div className="input-block">
            <label hltmfor="techs">Tecnologias</label>
            <input
              name="techs"
              id="techs"
              required
              value={techs}
              onChange={e => setTechs(e.target.value)}
            />
          </div>

          <div className="input-group">
            <div className="input-block">
              <label hltmfor="latitude">Latitude</label>
              <input
                type="number"
                name="latitude"
                id="latitude"
                required
                value={latitude}
                onChange={e => setLatitude(e.target.value)}
              />
            </div>

            <div className="input-block">
              <label hltmfor="longitude">Longitude</label>
              <input type="number"
                name="longitude"
                id="longitude"
                required
                value={longitude}
                onChange={e => setLongitude(e.target.value)}
              />
            </div>
          </div>
          <button type="submit">Salvar</button>
        </form>
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <li key={dev._id} className="dev-item">
              <header>
                <img src={dev.avatar_url} alt={dev.name} />
                <div className="user-info">
                  <strong>{dev.name}</strong>
                  <span>{dev.techs.join(', ')}</span>
                </div>
              </header>
              <p>{dev.bio}</p>
              <a href={`http://github.com/${dev.github_username}`}>Acessar perfil do GitHub</a>
            </li>
          ))}

        </ul>
      </main>
    </div>
  );
}

export default App;
