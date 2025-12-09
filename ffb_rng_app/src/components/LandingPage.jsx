import React, { useState } from 'react';
import { Form, Button, Spinner, Alert, Container, Row, Col, ListGroup } from 'react-bootstrap';

function LandingPage() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    try {
      setLoading(true);
      setError(null);

     const res = await fetch(`http://localhost:5000/api/data?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="mb-4 text-center">Server Integration</h1>

          {/* Form Input */}
          <Form onSubmit={handleSubmit} className="mb-3">
            <Form.Group controlId="queryInput">
              <Form.Control
                type="text"
                placeholder="Enter your query..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Form.Group>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading || !query.trim()}
              className="mt-2"
            >
              {loading ? (
                <>
                  <Spinner 
                    as="span" 
                    animation="border" 
                    size="sm" 
                    role="status" 
                    aria-hidden="true" 
                  />{' '}
                  Fetching...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </Form>

          {/* Error Message */}
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Results */}
          {data && (
            <div className="mt-4">
              <Alert variant="success">{data.message}</Alert>
              {data.items && (
                <ListGroup>
                  {data.items.map((item, index) => (
                    <ListGroup.Item key={index}>{item}</ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default LandingPage;