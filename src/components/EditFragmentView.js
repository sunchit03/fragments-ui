import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { getFragmentData } from '../api';
import toast, { Toaster } from 'react-hot-toast';
import Papa from 'papaparse';
const yaml = require('js-yaml');

const notify = (message) => toast.error(message);

function EditFragmentView({ user, fragmentId, type, setShowEditModal, editFragment }) {
  const [fragmentContent, setFragmentContent] = useState('');

  const fetchFragmentData = async () => {
    const data = await getFragmentData(user, fragmentId);
    if (data) {
      setFragmentContent(data);
    }
  };

  useEffect(() => {
    fetchFragmentData();
  }, []);

  const validateJSON = (data) => {
    try {
      JSON.parse(data);
      return true;
    } catch (error) {
      return false;
    }
  };

  const validateCSV = (content) => {
    const { data, errors } = Papa.parse(content, { skipEmptyLines: true });

    if (errors.length > 0 || data.length === 0) {
      return false;
    }
    return true;
  };

  const validateYAML = (input) => {
    try {
      yaml.load(input);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleFragmentUpdate = () => {
    if (!fragmentContent.trim()) {
      notify('Fragment cannot be empty');
      return;
    }

    if (type === 'application/json' && !validateJSON(fragmentContent)) {
      notify('Please enter a valid JSON');
      return;
    }

    if (type === 'text/csv' && !validateCSV(fragmentContent)) {
      notify('Invalid CSV format');
      return;
    }

    if (type === 'application/yaml' && !validateYAML(fragmentContent)) {
      notify('Invalid YAML format');
      return;
    }

    editFragment(fragmentId, fragmentContent);
  };

  return (
    <>
      {/* Edit Modal */}
      <Modal
        show={true}
        onHide={() => setShowEditModal({ show: false, fragmentId: null, type: null })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Fragment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Fragment ID: {fragmentId}</Form.Label>
              <br /> <br />
              <Form.Control
                as="textarea"
                rows={3}
                value={fragmentContent}
                onChange={(e) => setFragmentContent(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEditModal({ show: false, fragmentId: null })}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={() => handleFragmentUpdate()}>
            Edit
          </Button>
        </Modal.Footer>
      </Modal>

      <Toaster position="bottom-center" />
    </>
  );
}

export default EditFragmentView;
