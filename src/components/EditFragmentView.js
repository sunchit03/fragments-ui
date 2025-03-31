import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { getFragmentData } from '../api';
import toast, { Toaster } from 'react-hot-toast';
import Papa from 'papaparse';
const yaml = require('js-yaml');
import { acceptedTypes, validator } from '../validator';

const notify = (message) => toast.error(message);

function EditFragmentView({ user, fragmentId, type, setShowEditModal, editFragment }) {
  const [fragmentContent, setFragmentContent] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: acceptedTypes[type] ? { [type]: acceptedTypes[type] } : {},
    onDrop: (acceptedFiles) => {
      if (type && type.startsWith('image/')) {
      } else {
        const reader = new FileReader();
        reader.onload = (e) => setFragmentContent(e.target.result);
        reader.readAsText(acceptedFiles[0]);
      }
    },
  });

  const fetchFragmentData = async () => {
    const data = await getFragmentData(user, fragmentId);
    if (data) {
      if (type.startsWith('image/')) {
      } else {
        setFragmentContent(data);
      }
    } else {
      setFragmentContent('');
      setImageSrc(null);
    }
  };

  useEffect(() => {
    fetchFragmentData();
  }, []);

  const handleFragmentUpdate = async () => {
      notify('Fragment cannot be empty');
      return;
    }

      return;
    }

    const validate = validator(type, fragmentContent);
    if (!(await validate).success) {
      notify((await validate).message);
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
              {!type.startsWith('image/') ? (
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={fragmentContent}
                  onChange={(e) => setFragmentContent(e.target.value)}
                  required
                />
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center">
                </div>
              )}
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
