// App.js

import { useAuth } from 'react-oidc-context';
import MyNavbar from './components/MyNavbar';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function App() {
  const auth = useAuth();

  const [view, setView] = useState('homeView');

  // eslint-disable-next-line default-case
  switch (auth.activeNavigator) {
    case 'signinSilent':
      return <div>Signing you in...</div>;
    case 'signoutRedirect':
      return <div>Signing you out...</div>;
  }

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  console.log(auth.user);
  return (
    <div>
      <h1>Fragments UI</h1>
      <section>
        <MyNavbar auth={auth} setView={setView} />
        {/* <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="#home">Fragments App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {auth.isAuthenticated ? (
                  <>
                    <Nav.Link onClick={() => setView('homeView')}>Home</Nav.Link>
                    <Nav.Link onClick={() => setView('fragmentsView')}>View Fragments</Nav.Link>
                    <Nav.Link onClick={() => setView('createFragmentsView')}>
                      Create Fragments
                    </Nav.Link>
                    <Nav.Link onClick={() => auth.removeUser()}>Log Out</Nav.Link>
                  </>
                ) : (
                  <Nav.Link onClick={() => auth.signinRedirect()}>Log In</Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar> */}
      </section>
      <section id="user">
        <h2>
          Hello <span className="username">{auth.user?.profile['cognito:username']}</span>!
        </h2>
      </section>
    </div>
  );

  // if (auth.isAuthenticated) {
  //   return (
  //     <div>
  //       <pre> Hello: {auth.user?.profile.email} </pre>
  //       <pre> ID Token: {auth.user?.id_token} </pre>
  //       <pre> Access Token: {auth.user?.access_token} </pre>
  //       <pre> Refresh Token: {auth.user?.refresh_token} </pre>

  //       <button onClick={() => auth.removeUser()}>Sign out</button>
  //     </div>
  //   );
  // }

  // return (
  //   <div>
  //     <button onClick={() => auth.signinRedirect()}>Sign in</button>
  //     <button onClick={() => signOutRedirect()}>Sign out</button>
  //   </div>
  // );
}

export default App;
