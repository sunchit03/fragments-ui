import React, { useState, useEffect } from 'react';
import { Accordion, Spinner } from 'react-bootstrap';
import { getUserFragments, getFragmentData } from '../api';
import TabBar from './TabBar';

function FragmentsAccordion({ user }) {
  const [fragments, setFragments] = useState([]); // Holds only IDs
  const [fragmentDetails, setFragmentDetails] = useState({}); // Holds full fragment data
  const [loadingFragments, setLoadingFragments] = useState({}); // Tracks loading state

  const fetchFragments = async () => {
    const userFragments = await getUserFragments(user);

    if (userFragments && Array.isArray(userFragments.fragments)) {
      setFragments(userFragments.fragments);
    } else {
      setFragments([]);
    }
  }, [user, activeTab]);

  // Function to fetch a fragment's details when the user opens the accordion
  const fetchFragmentDetails = async (id) => {
    if (!fragmentDetails[id] && !loadingFragments[id]) {
      setLoadingFragments((prev) => ({ ...prev, [id]: true }));

      const fragmentData = await getFragmentData(user, id);
      setFragmentDetails((prev) => ({ ...prev, [id]: fragmentData }));
      setLoadingFragments((prev) => ({ ...prev, [id]: false }));
    }
  };

  useEffect(() => {
    if (user) {
      fetchFragments();
    }
  }, []);

  return (
    <div>
      <h2>Your Fragments</h2>

      <Accordion>
          return (
            <Accordion.Item key={fragmentId} eventKey={fragmentId}>
              <Accordion.Header onClick={() => fetchFragmentDetails(fragmentId)}>
                Fragment ID: {fragmentId}
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
    </div>
  );
}

export default FragmentsAccordion;
