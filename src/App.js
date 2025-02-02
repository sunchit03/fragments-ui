// App.js

import { useAuth } from 'react-oidc-context';
import MyNavbar from './components/MyNavbar';
import { useState } from 'react';
import UserFragmentsAccordion from './components/FragmentsView';
import CreateFragmentView from './components/CreateFragmentView';

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
      </section>
      {view === 'homeView' && (
        <section id="user">
          <h2>
            Hello <span className="username">{auth.user?.profile['cognito:username']}</span>!
          </h2>
        </section>
      )}
      {view === 'fragmentsView' && (
        <section id="fragmentsView">
          <UserFragmentsAccordion user={auth.user} />
        </section>
      )}
      {view === 'createFragmentsView' && (
        <section id="fragmentsCreate">
          <CreateFragmentView user={auth.user} />
        </section>
      )}
    </div>
  );
}

export default App;
