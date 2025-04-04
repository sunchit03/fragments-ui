import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import toast, { Toaster } from 'react-hot-toast';
import FragmentsView from './FragmentsView';

const notify = (message) => toast.error(message);

function SearchFragmentsView({ user }) {
  const [type, setType] = useState(null); // text/plain, text/markdown, text/html, text/csv, application/json, application/yaml
  const [minSize, setMinSize] = useState(null);
  const [maxSize, setMaxSize] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [query, setQuery] = useState(null);

  const [isSearchValid, setIsSearchValid] = useState(false);

  const dropDownOptions = {
    'text/plain': 'Plain Text (.txt)',
    'text/markdown': 'Markdown (.md)',
    'text/html': 'HTML (.html)',
    'text/csv': 'CSV (.csv)',
    'application/json': 'JSON (.json)',
    'application/yaml': 'YAML (.yaml)',
    'image/png': 'Image (.png)',
    'image/jpeg': 'Image (.jpg)',
    'image/webp': 'Image (.webp)',
    'image/gif': 'Image (.gif)',
    'image/avif': 'Image (.avif)',
  };

  const handleTypeSelect = (event) => {
    if (event.target.value) {
      setType(event.target.value);
    } else {
      setType(null);
    }
  };

  const handleSubmit = () => {
    console.log('clickedd');
    setIsSearchValid(false);

    if (!(type || minSize || maxSize || minDate || maxDate)) {
      notify('Please enter at least one parameter');
      return;
    }

    if (minSize && minSize < 1) {
      notify('Minimum size must be greater than or equal to 1');
      return;
    }

    if (maxSize && maxSize < 1) {
      notify('Maximum size must be greater than or equal to 1');
      return;
    }

    if (minSize && maxSize && minSize > maxSize) {
      notify('Minimum size must be lower than maximum size');
      return;
    }

    if (minDate && maxDate && minDate > maxDate) {
      notify('Minimum date must be lower than maximum date');
      return;
    }

    setQuery({
      type,
      minSize,
      maxSize,
      minDate: minDate ? new Date(minDate).toISOString() : null,
      maxDate: maxDate ? new Date(maxDate).toISOString() : null,
    });

    setIsSearchValid(true);
  };

  return (
    <>
      <div className="p-3" key={'inline-radio'}>
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridType">
              <Form.Label>Type</Form.Label>
              <Form.Select defaultValue="None" onChange={handleTypeSelect}>
                <option value={null}>None</option>
                {Object.keys(dropDownOptions).map((option) => (
                  <option key={option} value={option}>
                    {dropDownOptions[option]}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridMinSize">
              <Form.Label>Minimum Size</Form.Label>
              <Form.Control
                type="number"
                value={minSize}
                onChange={(e) => setMinSize(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridMaxSize">
              <Form.Label>Maximum Size</Form.Label>
              <Form.Control
                type="number"
                value={maxSize}
                onChange={(e) => setMaxSize(e.target.value)}
              />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId="formGridMinDate">
              <Form.Label>Minimum Creation Date</Form.Label>
              <Form.Control
                type="date"
                value={minDate}
                onChange={(e) => setMinDate(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridMaxDate">
              <Form.Label>Maximum Creation Date</Form.Label>
              <Form.Control
                type="date"
                value={maxDate}
                onChange={(e) => setMaxDate(e.target.value)}
              />
            </Form.Group>
          </Row>

          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Form>
      </div>
      <Toaster position="bottom-center" />

      {isSearchValid && <FragmentsView user={user} query={query} />}
    </>
  );
}

export default SearchFragmentsView;
