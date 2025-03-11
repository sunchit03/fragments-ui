import React, { useState, useEffect } from 'react';
import { Button, Dropdown, Form, Modal, SplitButton } from 'react-bootstrap';
import { getFragmentData, getFragmentInfo } from '../api';
import toast, { Toaster } from 'react-hot-toast';
import Papa from 'papaparse';
const yaml = require('js-yaml');

const notify = (message) => toast.error(message);

function EditFragmentView({ user, fragmentId, setShowEditModal, editFragment }) {
  const [fragmentContent, setFragmentContent] = useState('');
  const [type, setType] = useState(''); // text/plain, text/markdown, text/html, text/csv, application/json, application/yaml

  const fetchFragmentData = async () => {
    const data = await getFragmentData(user, fragmentId);
    const info = await getFragmentInfo(user, fragmentId);
    if (data) {
      setFragmentContent(data);
    }
    if (info.fragment) {
      setType(info.fragment.type);
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

    editFragment(fragmentId);

    // Clear input after successful submission
    setFragmentContent('');
  };

  return (
    <>
      {/* Edit Modal */}
      <Modal show={true} onHide={() => setShowEditModal({ show: false, fragmentId: null })}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Fragment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Fragment {fragmentId}</Form.Label>
              <SplitButton
                key={'right'}
                id={`dropdown-button-drop-right`}
                drop={'right'}
                variant="secondary"
                title={`Selected Type: ${type}`}
              >
                <Dropdown.Item onClick={() => setType('text/plain')}>
                  Plain Text (.txt)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setType('text/markdown')}>
                  Markdown (.md, .html, .txt)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setType('text/html')}>
                  HTML (.html, .txt)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setType('text/csv')}>
                  CSV (.csv, .txt, .json)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setType('application/json')}>
                  JSON (.json, .yaml, .yml, .txt)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setType('application/yaml')}>
                  YAML (.yaml, .txt)
                </Dropdown.Item>
              </SplitButton>
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
            Close
          </Button>
          <Button variant="primary" onClick={() => handleFragmentUpdate()}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <Toaster position="bottom-center" />
    </>
  );
}

export default EditFragmentView;
