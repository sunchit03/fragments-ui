import { Button, Modal } from 'react-bootstrap';

function DeleteFragmentView({ fragmentId, setShowDeleteModal, removeFragment }) {
  const handleFragmentDeletion = () => {
    removeFragment(fragmentId);
  };

  return (
    <>
      {/* Delete Modal */}
      <Modal show={true} onHide={() => setShowDeleteModal({ show: false, fragmentId: null })}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Fragment</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete fragment: {fragmentId}?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteModal({ show: false, fragmentId: null })}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleFragmentDeletion}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteFragmentView;
