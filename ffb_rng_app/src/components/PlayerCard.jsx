import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

export default function PlayerCard({ name, nickname, players, cutPlayers, onEliminate }) {
  return (
    <Card className="mb-4 shadow-sm h-100">
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Subtitle className="mb-3 text-muted">{nickname}</Card.Subtitle>

        <div className="d-flex justify-content-around mb-3">
          {players.map((player, index) => (
            <div key={index} className="text-center">
              <Image
                src={player.avatar}
                roundedCircle
                width={80}
                height={80}
                alt={player.name}
              />
              <div className="mt-2">{player.name}</div>
            </div>
          ))}
        </div>

        <Button variant="danger" onClick={onEliminate}>
          Eliminate Random Player
        </Button>
        {cutPlayers && cutPlayers.length > 0 && (
            <>
                <hr />
                <h6>Eliminated Players:</h6>
                <div className="d-flex justify-content-around">
                {cutPlayers.map((player, index) => (
                    <div key={index} className="text-center">
                    <Image
                        src={player.avatar}
                        roundedCircle
                        width={50}
                        height={50}
                        alt={player.name}
                    />
                    <div>{player.name}</div>
                    </div>
                ))}
                </div>
            </>
            )}
      </Card.Body>
    </Card>
  );
}