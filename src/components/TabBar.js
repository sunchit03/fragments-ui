import Nav from 'react-bootstrap/Nav';

function TabBar({ activeTab, setActiveTab }) {
  return (
    <Nav variant="tabs">
      <Nav.Item>
        <Nav.Link
          active={activeTab === 'IDs'}
          onClick={() => {
            if (activeTab !== 'IDs') {
              setActiveTab('IDs');
            }
          }}
        >
          IDs
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          active={activeTab === 'Expanded'}
          onClick={() => {
            if (activeTab !== 'Expanded') {
              setActiveTab('Expanded');
            }
          }}
        >
          Expanded
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default TabBar;
