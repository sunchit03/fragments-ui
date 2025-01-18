import React, { useState, useEffect } from 'react';
import { signIn, getUser } from './auth';
import { getUserFragments } from './api';
import './App.css';

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    async function init() {
      // See if we're signed in (i.e., we'll have a `user` object)
      const user = await getUser();
      if (user) {
        setUser(user);
      }
      // Do an authenticated request to the fragments API server and log the result
      const userFragments = await getUserFragments(user);

      // TODO: later in the course, we will show all the user's fragments in the HTML...
    }

    init();
  }, [])

  // Wire up event handlers to deal with login and logout.
  const handleLoginClick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    signIn();
  }

  return (
     <div>
      <h1>Fragments UI</h1>
      <section>
        <nav>
          {user ? 
            <button id="login" disabled>Login</button>
          :
          <button id="login" onClick={handleLoginClick}>Login</button>
          }
        </nav>
      </section>
      {user && (
        <section id="user">
          <h2>
            Hello <span className="username">{user.username}</span>!
          </h2>
        </section>
      )}
    </div>
  );
}

export default App;
