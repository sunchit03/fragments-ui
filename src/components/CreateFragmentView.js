import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import SplitButton from 'react-bootstrap/SplitButton';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { createNewFragment } from '../api';
import toast, { Toaster } from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
const yaml = require('js-yaml');

const notify = (message) => toast.error(message);

function CreateFragmentView({ user }) {
  const [type, setType] = useState(''); // text/plain, text/markdown, text/html, text/csv, application/json, application/yaml
  const [fragmentContent, setFragmentContent] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md', '.txt'],
      'text/html': ['.html', '.txt'],
      'text/csv': ['.csv', '.txt'],
      'application/json': ['.json', '.txt'],
    },
    onDrop: (acceptedFiles) => {
      const reader = new FileReader();
      reader.onload = (e) => setFragmentContent(e.target.result);
      reader.readAsText(acceptedFiles[0]);
    },
  });

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!fragmentContent.trim()) {
      notify('Fragment cannot be empty');
      return;
    }

    if (type === '') {
      notify('Please select a type');
      return;
    }

    if (type === 'application/json' && !validateJSON(fragmentContent)) {
      notify('Invalid JSON format');
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

    // Call API to create the fragment
    const data = await createNewFragment(user, fragmentContent, type);

    if (data.status !== 'ok') {
      notify(`${data.error.message} (${data.error.code}) `);
      return;
    }

    toast.success('Fragment created successfully!');

    // Clear input after successful submission
    setFragmentContent('');
  };

  return (
    <>
      <Form noValidate onSubmit={handleSubmit} className="p-3">
        <Form.Group className="mb-3">
          <Form.Label>Enter your fragment:</Form.Label>
          <br />
          <SplitButton
            key={'right'}
            id={`dropdown-button-drop-right`}
            drop={'right'}
            variant="secondary"
            title={type ? `Selected Type: ${type}` : 'Select Type'}
          >
            <Dropdown.Item onClick={() => setType('text/plain')}>Plain Text (.txt)</Dropdown.Item>
            <Dropdown.Item onClick={() => setType('text/markdown')}>
              Markdown (.md, .html, .txt)
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setType('text/html')}>HTML (.html, .txt)</Dropdown.Item>
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

          <br />
          <br />

          {/* Drag & Drop Zone */}
          <div
            {...getRootProps()}
            style={{
              border: '2px dashed #ccc',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              marginBottom: '10px',
            }}
          >
            <input {...getInputProps()} />
            Drag & drop your file here, or click to select one.
          </div>

          <br />

          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Type here or drop a file..."
            value={fragmentContent}
            onChange={(e) => setFragmentContent(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit">Submit</Button>
      </Form>
      <Toaster position="bottom-center" />
    </>
  );
}

export default CreateFragmentView;
