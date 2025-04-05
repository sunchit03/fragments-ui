// App.js

import { useAuth } from 'react-oidc-context';
import MyNavbar from './components/MyNavbar';
import { useState } from 'react';
import FragmentsView from './components/FragmentsView';
import CreateFragmentView from './components/CreateFragmentView';
import SearchFragmentsView from './components/SearchFragmentsView';

function App() {
  const auth = useAuth();

  const [view, setView] = useState('homeView');
  const spacing = 80;

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
      <section>
        <MyNavbar auth={auth} view={view} setView={setView} />
      </section>
      {view === 'homeView' && (
        <section id="user">
          <h2 style={{ marginTop: spacing + 'px' }}>
            Hello <span className="username">{auth.user?.profile['cognito:username']}</span>!
          </h2>
        </section>
      )}
      {view === 'fragmentsView' && (
        <section id="fragmentsView">
          <FragmentsView user={auth.user} />
        </section>
      )}
      {view === 'createFragmentsView' && (
        <section id="fragmentsCreate">
          <CreateFragmentView user={auth.user} />
        </section>
      )}
      {view === 'searchFragmentsView' && (
        <section id="fragmentsSearch">
          <SearchFragmentsView user={auth.user} />
        </section>
      )}
    </div>
  );
}

export default App;
