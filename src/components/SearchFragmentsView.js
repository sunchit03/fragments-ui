import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import toast, { Toaster } from 'react-hot-toast';
import FragmentsView from './FragmentsView';

const notify = (message) => toast.error(message);

function SearchFragmentsView({ user }) {
  const [fragmentId, setFragmentId] = useState(null);
  const [type, setType] = useState(null); // text/plain, text/markdown, text/html, text/csv, application/json, application/yaml
  const [minSize, setMinSize] = useState(null);
  const [maxSize, setMaxSize] = useState(null);
  const [radioValue, setRadioValue] = useState('any');
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
      setType(dropDownOptions[event.target.value]);
    } else {
      setType(null);
    }
  };

  const handleRadioSelect = (event) => {
    setRadioValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    setIsSearchValid(false);

    if (!(type || fragmentId || minSize || maxSize)) {
      notify('Please enter at least one parameter');
      return;
    }

    setQuery({
      fragmentId,
      type,
      minSize,
      maxSize,
      radioValue,
    });

    setIsSearchValid(true);
  };

  return (
    <>
      <div className="p-3" key={'inline-radio'}>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="formFragmentId">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                value={fragmentId}
                onChange={(e) => setFragmentId(e.target.value)}
                placeholder="Enter Fragment ID"
              />
            </Form.Group>

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
              <Form.Control type="number" min={1} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridMaxSize">
              <Form.Label>Maximum Size</Form.Label>
              <Form.Control type="number" min={1} />
            </Form.Group>
          </Row>

          <div key={`inline-radio`} className="mb-3">
            <Form.Check
              type="radio"
              label="Match any of the following"
              name="anyOrOnly"
              id="anyRadio"
              value={'any'}
              checked={radioValue === 'any'}
              onChange={handleRadioSelect}
            />
            <Form.Check
              type="radio"
              label="Match all of the following"
              name="anyOrOnly"
              id="onlyRadio"
              value={'only'}
              checked={radioValue === 'only'}
              onChange={handleRadioSelect}
            />
          </div>

          <Button variant="primary" type="submit">
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
