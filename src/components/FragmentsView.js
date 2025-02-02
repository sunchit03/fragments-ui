import React, { useState, useEffect } from 'react';
import { Accordion, Spinner } from 'react-bootstrap';
import { getUserFragments, getFragmentData } from '../api';

function FragmentsAccordion({ user }) {
  const [fragmentIds, setFragmentIds] = useState([]); // Holds only IDs
  const [fragmentDetails, setFragmentDetails] = useState({}); // Holds full fragment data
  const [loadingFragments, setLoadingFragments] = useState({}); // Tracks loading state

  useEffect(() => {
    const fetchFragments = async () => {
      const userFragments = await getUserFragments(user);

      const fragmentIDs =
        userFragments && Array.isArray(userFragments.fragments) ? userFragments.fragments : [];

      console.log(fragmentIDs);
      setFragmentIds(fragmentIDs);
    };

    if (user) {
      fetchFragments();
    }
  }, [user]);

  // Function to fetch a fragment's details when the user opens the accordion
  const fetchFragmentDetails = async (id) => {
    if (!fragmentDetails[id] && !loadingFragments[id]) {
      setLoadingFragments((prev) => ({ ...prev, [id]: true }));

      const fragmentData = await getFragmentData(user, id);
      setFragmentDetails((prev) => ({ ...prev, [id]: fragmentData }));
      setLoadingFragments((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div>
      <h2>Your Fragments</h2>
      <Accordion>
        {fragmentIds.map((id) => (
          <Accordion.Item key={id} eventKey={id}>
            <Accordion.Header onClick={() => fetchFragmentDetails(id)}>
              Fragment ID: {id}
            </Accordion.Header>
            <Accordion.Body>
              {loadingFragments[id] ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <div>{fragmentDetails[id] || 'Click to load fragment data'}</div>
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}

export default FragmentsAccordion;
