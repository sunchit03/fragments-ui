import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import SplitButton from 'react-bootstrap/SplitButton';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import { createNewFragment } from '../api';
import toast, { Toaster } from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { acceptedTypes, validator } from '../validator';

const notify = (message) => toast.error(message);

function CreateFragmentView({ user }) {
  const [type, setType] = useState(null); // text/plain, text/markdown, text/html, text/csv, application/json, application/yaml
  const [fragmentContent, setFragmentContent] = useState('');
  const [isImgUploaded, setIsImgUploaded] = useState({ uploaded: false, preview: null });
  const spacing = 60;

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!type) {
      notify('Please select a type');
      return;
    }

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

    // Call API to create the fragment
    const data = await createNewFragment(user, fragmentContent, type);

    if (!data) {
      notify(`Error creating fragment`);
      return;
    }

    toast.success('Fragment created successfully!');

    // Clear input after successful submission
    setFragmentContent('');
    setIsImgUploaded({ uploaded: false, preview: null });
  };

  return (
    <>
      <Form
        noValidate
        onSubmit={handleSubmit}
        className="p-3"
        style={{ marginTop: spacing + 'px' }}
      >
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
            {Object.keys(dropDownOptions).map((option, index) => (
              <Dropdown.Item key={index} onClick={() => setType(option)}>
                {dropDownOptions[option]}
              </Dropdown.Item>
            ))}
          </SplitButton>

          <br />
          <br />

          {/* Drag & Drop Zone */}
          <div
            {...getRootProps({
              onClick: (e) => {
                if (!type) {
                  e.stopPropagation();
                  notify('Please select a type first');
                  return;
                }
              },
              onDrop: (e) => {
                if (!type) {
                  e.preventDefault();
                  e.stopPropagation();
                  notify('Please select a type first');
                  return;
                }
              },
            })}
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

          {(!type || !type.startsWith('image/')) && (
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Type here or drop a file..."
              value={fragmentContent}
              onChange={(e) => setFragmentContent(e.target.value)}
              required
            />
          )}

          {type && type.startsWith('image') && isImgUploaded.uploaded && (
            <div className="d-flex flex-column align-items-center justify-content-center">
              <Image
                src={isImgUploaded.preview}
                onLoad={() => {
                  URL.revokeObjectURL(isImgUploaded.preview);
                }}
                fluid
              />
            </div>
          )}
        </Form.Group>

        <Button type="submit">Submit</Button>
      </Form>
      <Toaster position="bottom-center" />
    </>
  );
}

export default CreateFragmentView;
