const SERVER_URL =
  window.process.env.API_PROTOCOL + window.process.env.API_HOST;

export {
  login,
  fetchAccounts,
  postNewAccount,
  fetchAccount,
  postTransaction,
  fetchCurrencyTypes,
  fetchCurrencies,
  postCurrencyExchange,
  fetchBanks,
};

function login(login, password) {
  const responseJson = tryFetch(() => {
    return fetch(`${SERVER_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });
  });

  return responseJson;
}

function fetchAccounts(token) {
  const responseJson = tryFetch(() => {
    return fetch(`${SERVER_URL}/accounts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${token}`,
      },
    });
  });

  return responseJson;
}

function postNewAccount(token) {
  const responseJson = tryFetch(() => {
    return fetch(`${SERVER_URL}/create-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${token}`,
      },
    });
  });

  return responseJson;
}

function fetchAccount(id, token) {
  const responseJson = tryFetch(() => {
    return fetch(`${SERVER_URL}/account/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${token}`,
      },
    });
  });

  return responseJson;
}

function postTransaction(from, to, amount, token) {
  const responseJson = tryFetch(() => {
    return fetch(`${SERVER_URL}/transfer-funds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${token}`,
      },
      body: JSON.stringify({ from, to, amount }),
    });
  });

  return responseJson;
}

function fetchCurrencyTypes() {
  const responseJson = tryFetch(() => {
    return fetch(`${SERVER_URL}/all-currencies`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  return responseJson;
}

function fetchCurrencies(token) {
  const responseJson = tryFetch(() => {
    return fetch(`${SERVER_URL}/currencies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${token}`,
      },
    });
  });

  return responseJson;
}

function postCurrencyExchange(from, to, amount, token) {
  const responseJson = tryFetch(() => {
    return fetch(`${SERVER_URL}/currency-buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${token}`,
      },
      body: JSON.stringify({ from, to, amount }),
    });
  });

  return responseJson;
}

function fetchBanks() {
  const responseJson = tryFetch(() => {
    return fetch(`${SERVER_URL}/banks`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  return responseJson;
}

async function tryFetch(fetchFunction) {
  let response;

  try {
    response = await fetchFunction();
  } catch (error) {
    error.name = 'NetworkError';
    throw error;
  }

  if (!response.ok) {
    let error = new Error();
    error.name = 'ResponseError';
    error.status = response.status;
    throw error;
  }

  return await response.json();
}
