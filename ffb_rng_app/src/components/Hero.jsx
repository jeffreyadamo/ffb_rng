import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

export default function Hero({ onReset }) {
  return (
    <div className="bg-light py-5">
      <Container className="text-center">
        <h1 className="display-4">Random Keeper Generator</h1>
        <p className="lead">3 enter. 1 dies.</p>
        <Button variant="primary" size="lg" onClick={onReset}>
          Reset
        </Button>
      </Container>
    </div>
  );
}