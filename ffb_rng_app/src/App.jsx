import { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Body from './components/Body.jsx';
import Footer from './components/Footer.jsx';
import initialData from './data/cards.json';

function App() {
  const [teams, setTeams] = useState(initialData);
  const [cutPlayers, setCutPlayers] = useState([]);

  const resetGame = () => {
    setTeams(initialData);
    setCutPlayers([]);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Hero onReset={resetGame} />
      <Body
        teams={teams}
        setTeams={setTeams}
        cutPlayers={cutPlayers}
        setCutPlayers={setCutPlayers}
      />
      <Footer />
    </div>
  );
}

export default App;