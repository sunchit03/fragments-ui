import React, { useState, useEffect } from 'react';
import { Button, Form, Image, Modal } from 'react-bootstrap';
import { getFragmentData } from '../api';
import toast, { Toaster } from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { acceptedTypes, validator } from '../validator';

const notify = (message) => toast.error(message);

function EditFragmentView({ user, fragmentId, type, setShowEditModal, editFragment }) {
  const [fragmentContent, setFragmentContent] = useState('');
  const [imageSrc, setImageSrc] = useState(null);
  const [isImgUploaded, setIsImgUploaded] = useState({ uploaded: false, preview: null });

  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: acceptedTypes[type] ? { [type]: acceptedTypes[type] } : {},
    onDrop: (acceptedFiles) => {
      if (type && type.startsWith('image/')) {
        setIsImgUploaded({ uploaded: true, preview: URL.createObjectURL(acceptedFiles[0]) });
        setFragmentContent(acceptedFiles[0]);
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
        console.log(data);
        const url = URL.createObjectURL(data);
        setImageSrc(url);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFragmentUpdate = async () => {
    if (!type.startsWith('image/') && !fragmentContent.trim() && !isImgUploaded.uploaded) {
      notify('Fragment cannot be empty');
      return;
    }

    if (type.startsWith('image/') && !isImgUploaded.uploaded) {
      notify('Please upload an image');
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
                  {imageSrc && (
                    <Image
                      src={isImgUploaded.uploaded ? isImgUploaded.preview : imageSrc}
                      onLoad={() => {
                        URL.revokeObjectURL(
                          isImgUploaded.uploaded ? isImgUploaded.preview : imageSrc
                        );
                      }}
                      fluid
                    />
                  )}
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
