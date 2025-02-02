import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { createNewFragment } from '../api';

function CreateFragmentView({ user }) {
  const [fragmentContent, setFragmentContent] = useState('');
  const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!fragmentContent.trim()) {
      setValidated(true);
      return;
    }

    // Call API to create the fragment
    await createNewFragment(user, fragmentContent);

    // Clear input after successful submission
    setFragmentContent('');
    setValidated(false);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit} className="p-3">
      <Form.Group className="mb-3">
        <Form.Label>Enter your fragment:</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Type here..."
          value={fragmentContent}
          onChange={(e) => setFragmentContent(e.target.value)}
          required
          isInvalid={validated && !fragmentContent.trim()}
        />
        <Form.Control.Feedback type="invalid">Fragment cannot be empty.</Form.Control.Feedback>
      </Form.Group>

      <Button type="submit">Submit</Button>
    </Form>
  );
}

export default CreateFragmentView;
