import { useState } from 'react';
import PlayerCard from './PlayerCard.jsx';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';   // <-- missing import
import initialData from '../data/cards.json';

export default function Body({ teams, setTeams, cutPlayers, setCutPlayers }) {
    const eliminateRandomPlayer = (teamIndex) => {
    const team = teams[teamIndex];

    if (team.players.length === 0) return;

    const randomIndex = Math.floor(Math.random() * team.players.length);
    const eliminated = team.players[randomIndex];

    const remainingPlayers = team.players.filter((_, i) => i !== randomIndex);

    const updatedTeam = {
        ...team,
        players: remainingPlayers,
        cutPlayers: [...(team.cutPlayers || []), eliminated],
    };

    const updatedTeams = teams.map((t, i) =>
        i === teamIndex ? updatedTeam : t
    );

    setTeams(updatedTeams);
    };
  return (
    <Container className="my-5">
      <Row xs={1} md={2} lg={3} className="g-4">
        {teams.map((team, index) => (
          <Col key={index}>
            <PlayerCard
              {...team}
              cutPlayers={team.cutPlayers || []}
              onEliminate={() => eliminateRandomPlayer(index)}
            />
          </Col>
        ))}
      </Row>

      <h4 className="mt-5">Eliminated Players:</h4>
      <div className="d-flex flex-wrap gap-4">
        {cutPlayers.map((player, index) => (
          <div key={index} className="text-center">
            <Image
              src={player.avatar}
              roundedCircle
              width={60}
              height={60}
              alt={player.name}
            />
            <div>{player.name}</div>
          </div>
        ))}
      </div>
    </Container>
  );
}