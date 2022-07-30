function parseJwt(token) {
  if (!token) {
    return {};
  }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  return JSON.parse(jsonPayload || '{}');
}

function setUser(data) {
  localStorage.setItem('user', JSON.stringify(data));
}

function getUser() {
  const { accessToken = '' } = JSON.parse(localStorage.getItem('user') || '{}');
  return parseJwt(accessToken) || {};
}

function getAuthHeaderObj(isRefresh) {
  const { accessToken = '', refreshToken = '' } = JSON.parse(
    localStorage.getItem('user') || '{}'
  );
  return {
    'x-auth-token': isRefresh ? refreshToken : accessToken,
  };
}

async function handleTokenRefresh(response, callback) {
  try {
    if (typeof response.code !== 'undefined' && response.code === 0) {
      // Call /token with refreshToken to get new access/refresh tokens
      const url = `/token`;
      const res = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaderObj(true),
      });
      const data = await res.json();
      if (data.error && data.code === 1) {
        // We need need reauthentication. Return the
        // object containing the error
        return data;
      } else {
        // Set the user with the new access/refresh token
        setUser(data);
        if (callback) {
          // Callback with false flag to ensure we don't
          // get stuck in an infinte loop.
          callback(false);
        }
        return {};
      }
    }
    return response;
  } catch (error) {
    return {
      error: 'Error',
    };
  }
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export {
  parseJwt,
  getUser,
  setUser,
  getAuthHeaderObj,
  handleTokenRefresh,
  formatter,
};
