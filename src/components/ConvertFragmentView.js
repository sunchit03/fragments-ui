import React, { useState, useEffect } from 'react';
import { Dropdown, Form, Image, Modal, SplitButton } from 'react-bootstrap';

function ConvertFragmentView({ fragmentId, type, setShowConversionModal, convertFragment }) {
  const [conversionTypes, setConversionTypes] = useState([]);
  const [selectedConversionType, setSelectedConversionType] = useState(null);
  const [content, setContent] = useState('');
  const [imageSrc, setImageSrc] = useState(null);

  const conversions = {
    'text/plain': ['.txt'],
    'text/markdown': ['.md', '.html', '.txt'],
    'text/html': ['.html', '.txt'],
    'text/csv': ['.csv', '.txt', '.json'],
    'application/json': ['.json', '.yaml', '.yml', '.txt'],
    'application/yaml': ['.yaml', '.txt'],
    'image/png': ['.png', '.jpg', '.webp', '.gif', '.avif'],
    'image/jpeg': ['.png', '.jpg', '.webp', '.gif', '.avif'],
    'image/webp': ['.png', '.jpg', '.webp', '.gif', '.avif'],
    'image/avif': ['.png', '.jpg', '.webp', '.gif', '.avif'],
    'image/gif': ['.png', '.jpg', '.webp', '.gif', '.avif'],
  };

  useEffect(() => {
    setConversionTypes(conversions[type]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleFragmentConversion = async (conversionType) => {
    setSelectedConversionType(conversionType);
    const conversion = await convertFragment(fragmentId, conversionType);
    if (conversion) {
      if (type.startsWith('image/')) {
        console.log(conversion);
        const url = URL.createObjectURL(conversion);
        setImageSrc(url);
      } else {
        setContent(conversion);
      }
    } else {
      setContent('');
      setImageSrc(null);
    }
  };

  return (
    <>
      {/* Convert Modal */}
      <Modal
        show={true}
        onHide={() => setShowConversionModal({ show: false, fragmentId: null, type: null })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Convert Fragment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mr-2">Select the type you want to convert the fragment to:</p>
          <SplitButton
            key={'right'}
            id={`dropdown-button-drop-right`}
            drop={'right'}
            variant="secondary"
            title={selectedConversionType ? `Selected Type: ${selectedConversionType}` : 'Select'}
          >
            {conversionTypes.map((conversionType, index) => (
              <Dropdown.Item key={index} onClick={() => handleFragmentConversion(conversionType)}>
                {conversionType}
              </Dropdown.Item>
            ))}
          </SplitButton>
          {selectedConversionType && (
            <>
              <br />
              <br />
              {!type.startsWith('image/') ? (
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled
                />
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center">
                  {imageSrc && (
                    <Image
                      src={imageSrc}
                      onLoad={() => {
                        URL.revokeObjectURL(imageSrc);
                      }}
                      fluid
                    />
                  )}
                </div>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ConvertFragmentView;
