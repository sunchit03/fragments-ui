import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function MyNavbar({ auth, view, setView }) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>Fragments App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {auth.isAuthenticated ? (
              <>
                <Nav.Link active={view === 'homeView'} onClick={() => setView('homeView')}>
                  Home
                </Nav.Link>
                <Nav.Link
                  active={view === 'fragmentsView'}
                  onClick={() => setView('fragmentsView')}
                >
                  View Fragments
                </Nav.Link>
                <Nav.Link
                  active={view === 'createFragmentsView'}
                  onClick={() => setView('createFragmentsView')}
                >
                  Create Fragments
                </Nav.Link>
                <Nav.Link
                  active={view === 'searchFragmentsView'}
                  onClick={() => setView('searchFragmentsView')}
                >
                  Search Fragments
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    void auth.removeUser();
                    setView('homeView');
                  }}
                >
                  Log Out
                </Nav.Link>
              </>
            ) : (
              <Nav.Link
                onClick={() => {
                  void auth.signinRedirect();
                  setView('homeView');
                }}
              >
                Log In
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
