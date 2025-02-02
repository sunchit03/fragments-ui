import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bamboo.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// index.js
import { AuthProvider } from 'react-oidc-context';
import { WebStorageStateStore } from 'oidc-client-ts';

const cognitoAuthConfig = {
  authority: `https://cognito-idp.us-east-1.amazonaws.com/${process.env.REACT_APP_AWS_COGNITO_POOL_ID}`,
  client_id: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
  redirect_uri: `${process.env.REACT_APP_OAUTH_SIGN_IN_REDIRECT_URL}`,
  response_type: 'code',
  scope: 'phone openid email',
  // no revoke of "access token" (https://github.com/authts/oidc-client-ts/issues/262)
  revokeTokenTypes: ['refresh_token'],
  // no silent renew via "prompt=none" (https://github.com/authts/oidc-client-ts/issues/366)
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));

// wrap the application with AuthProvider
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
