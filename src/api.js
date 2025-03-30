// src/api.js

// fragments microservice API to use, defaults to localhost:8080 if not set in env
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user, expanded = false) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments${expanded ? '?expand=1' : ''}`, {
      // Generate headers with the proper Authorization bearer token to pass.
      // We are using the `authorizationHeaders()` helper method we defined
      // earlier, to automatically attach the user's ID token.
      headers: {
        Authorization: `Bearer ${user.id_token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Successfully got user fragments data', { data });
    return data;
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function getFragmentData(user, fragmentId) {
  console.log(`Requesting data for fragment with ID ${fragmentId}...`);
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
      // Generate headers with the proper Authorization bearer token to pass.
      // We are using the `authorizationHeaders()` helper method we defined
      // earlier, to automatically attach the user's ID token.
      headers: {
        Authorization: `Bearer ${user.id_token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.text();
    console.log(`Successfully got details for fragment with ID ${fragmentId}`, { data });
    return data;
  } catch (err) {
    console.error(`Unable to call GET /v1/fragment/${fragmentId}`, { err });
  }
}

export async function getFragmentInfo(user, fragmentId) {
  console.log(`Requesting info for fragment with ID ${fragmentId}...`);
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}/info`, {
      // Generate headers with the proper Authorization bearer token to pass.
      // We are using the `authorizationHeaders()` helper method we defined
      // earlier, to automatically attach the user's ID token.
      headers: {
        Authorization: `Bearer ${user.id_token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log(`Successfully got info for fragment with ID ${fragmentId}`, { data });
    return data;
  } catch (err) {
    console.error(`Unable to call GET /v1/fragment/${fragmentId}/info`, { err });
  }
}

export async function createNewFragment(user, fragmentData, contentType) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      // Generate headers with the proper Authorization bearer token to pass.
      // We are using the `authorizationHeaders()` helper method we defined
      // earlier, to automatically attach the user's ID token.
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.id_token}`,
        'Content-Type': contentType,
      },
      body: fragmentData,
    });
    // if (!res.ok) {
    //   throw new Error(`${res.status} ${res.statusText}`);
    // }
    const data = await res.json();
    console.log(`Successfully created new fragment with ID ${data.fragment.id}`, { data });
    return data;
  } catch (err) {
    console.error(`Unable to call POST /v1/fragment`, { err });
  }
}

export async function deleteFragment(user, fragmentId) {
  console.log(`Deleting fragment with ID ${fragmentId}...`);
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${fragmentId}`, {
      // Generate headers with the proper Authorization bearer token to pass.
      // We are using the `authorizationHeaders()` helper method we defined
      // earlier, to automatically attach the user's ID token.
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.id_token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log(`Successfully deleted fragment with ID ${fragmentId}`, { data });
    return data;
  } catch (err) {
    console.error(`Unable to call DELETE /v1/fragment/${fragmentId}`, { err });
  }
}
