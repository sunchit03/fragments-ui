import React, { useState, useEffect } from 'react';
import { Accordion, Spinner } from 'react-bootstrap';
import { getUserFragments, getFragmentData } from '../api';
import TabBar from './TabBar';

function FragmentsAccordion({ user }) {
  const [activeTab, setActiveTab] = useState('IDs');
  const [fragments, setFragments] = useState([]); // Holds only IDs
  const [fragmentDetails, setFragmentDetails] = useState({}); // Holds full fragment data
  const [loadingFragments, setLoadingFragments] = useState({}); // Tracks loading state

  useEffect(() => {
    const fetchFragments = async () => {
      const userFragments = await getUserFragments(user, activeTab === 'Expanded');

      if (userFragments && Array.isArray(userFragments.fragments)) {
        setFragments(userFragments.fragments);
      } else {
        setFragments([]);
      }
    };

    if (user) {
      fetchFragments();
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

  return (
    <div>
      <h2>Your Fragments</h2>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <Accordion>
        {fragments.map((fragment) => {
          // Ensure we always extract the correct `id` (whether `fragments` is a list of strings or objects)
          const fragmentId = typeof fragment === 'string' ? fragment : fragment.id;
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
                    {activeTab === 'Expanded' && <pre>{JSON.stringify(fragment, null, 2)}</pre>}
                    {fragmentDetails[fragmentId] || 'Click to load fragment data'}
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
