import React, { useState, useEffect } from 'react';
import { Accordion, Spinner, Stack } from 'react-bootstrap';
import { TfiTrash } from 'react-icons/tfi';
import { GrFormView } from 'react-icons/gr';
import toast, { Toaster } from 'react-hot-toast';
import {
  getUserFragments,
  getFragmentInfo,
  deleteFragment,
  getFragmentData,
  updateFragment,
} from '../api';
import DeleteFragmentView from './DeleteFragmentView';
import EditFragmentView from './EditFragmentView';

function FragmentsAccordion({ user }) {
  const [fragments, setFragments] = useState([]); // Holds only IDs
  const [fragmentDetails, setFragmentDetails] = useState({}); // Holds full fragment info
  const [loadingFragments, setLoadingFragments] = useState({}); // Tracks loading state
  const [selectedFragment, setSelectedFragment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState({ show: false, fragmentId: null });
  const [showEditModal, setShowEditModal] = useState({ show: false, fragmentId: null, type: null });

  const fetchFragments = async () => {
    const userFragments = await getUserFragments(user);

    if (userFragments && Array.isArray(userFragments.fragments)) {
      setFragments(userFragments.fragments);
    } else {
      setFragments([]);
    }
  };

  // Function to fetch a fragment's info when the user opens the accordion
  const fetchFragmentInfo = async (id) => {
    if (!fragmentDetails[id] && !loadingFragments[id]) {
      setLoadingFragments((prev) => ({ ...prev, [id]: true }));

      const info = await getFragmentInfo(user, id);
      setFragmentDetails((prev) => ({ ...prev, [id]: info.fragment }));
      setLoadingFragments((prev) => ({ ...prev, [id]: false }));
    }
  };

  useEffect(() => {
    if (user) {
      fetchFragments();
    }
  }, []);

  const removeFragment = async (fragmentId) => {
    const data = await deleteFragment(user, fragmentId);

    if (data) {
      setFragments((prevFragments) =>
        prevFragments.filter((prevFragment) => prevFragment !== fragmentId)
      );
      toast.success(`Fragment ${fragmentId} deleted successfully!`);
    } else {
      toast.error('Error deleting fragment.');
    }

    setShowDeleteModal({ show: false, fragmentId: null });
  };

  const editFragment = async (fragmentId, fragmentContent) => {
    const data = await updateFragment(user, fragmentId, fragmentContent, showEditModal.type);

    if (data) {
      if (fragmentDetails[fragmentId]) {
        setFragmentDetails((prev) => ({ ...prev, [fragmentId]: false }));
        setLoadingFragments((prev) => ({ ...prev, [fragmentId]: false }));

        if (fragmentId === selectedFragment) {
          console.log('updating!');
          setLoadingFragments((prev) => ({ ...prev, [fragmentId]: true }));

          const info = await getFragmentInfo(user, fragmentId);
          setFragmentDetails((prev) => ({ ...prev, [fragmentId]: info.fragment }));
          setLoadingFragments((prev) => ({ ...prev, [fragmentId]: false }));
        }
      }
      toast.success(`Fragment ${fragmentId} updated successfully`);
    } else {
      toast.error(`Error updating fragment`);
    }

    setShowEditModal({ show: false, fragmentId: null, type: null });
  };

  const openModal = async (fragmentId, modal) => {
    let type;
    if (fragmentDetails[fragmentId]) {
      type = fragmentDetails[fragmentId].type;
    } else {
      const info = await getFragmentInfo(user, fragmentId);
      type = info.fragment.type;
    }

    if (modal === 'edit') {
      setShowEditModal({ show: true, fragmentId, type });
    } else {
    }
  };

  };

  return (
    <div>
      <h2>Your Fragments</h2>

      <Accordion>
        {fragments.map((fragmentId) => {
          return (
            <Accordion.Item key={fragmentId} eventKey={fragmentId}>
              <Accordion.Header
                onClick={() => {
                  setSelectedFragment(fragmentId);
                  fetchFragmentInfo(fragmentId);
                }}
              >
                <Stack
                  direction="horizontal"
                  gap={10}
                  style={{ width: '100%', justifyContent: 'space-between' }}
                >
                  <div className="p-2">Fragment ID: {fragmentId}</div>
                  <Stack
                    direction="horizontal"
                    gap={10}
                    style={{ justifyContent: 'space-between' }}
                  >
                    <div
                      className="p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(fragmentId, 'edit');
                      }}
                    >
                      <GrFormView />
                    </div>
                    <div
                      className="p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDeleteModal({ show: true, fragmentId });
                      }}
                    >
                      <TfiTrash />
                    </div>
                  </Stack>
                </Stack>
              </Accordion.Header>
              <Accordion.Body>
                {loadingFragments[fragmentId] ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <div>
                    <pre>{JSON.stringify(fragmentDetails[fragmentId], null, 2)}</pre>
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>

      <Toaster position="bottom-center" />

      {showDeleteModal.show && (
        <DeleteFragmentView
          fragmentId={showDeleteModal.fragmentId}
          setShowDeleteModal={setShowDeleteModal}
          removeFragment={removeFragment}
        />
      )}

      {showEditModal.show && (
        <EditFragmentView
          user={user}
          fragmentId={showEditModal.fragmentId}
          type={showEditModal.type}
          setShowEditModal={setShowEditModal}
          editFragment={editFragment}
        />
      )}
    </div>
  );
}

export default FragmentsAccordion;
