import React, { useState, useEffect } from 'react';
import { Accordion, Spinner } from 'react-bootstrap';
import { getUserFragments, getFragmentData } from '../api';
import TabBar from './TabBar';

function FragmentsAccordion({ user }) {
  const [fragments, setFragments] = useState([]); // Holds only IDs
  const [fragmentDetails, setFragmentDetails] = useState({}); // Holds full fragment info
  const [loadingFragments, setLoadingFragments] = useState({}); // Tracks loading state

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

  return (
    <div>
      <h2>Your Fragments</h2>

      <Accordion>
        {fragments.map((fragmentId) => {
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
