const API_BASE = 'https://api.football-data.org/v4';

exports.handler = async (event) => {
  const apiKey = process.env.EXPO_PUBLIC_FOOTBALL_DATA_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Missing API key.' }),
    };
  }

  const path = (event.queryStringParameters && event.queryStringParameters.path) || '';
  if (!path || path.includes('..')) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid path.' }),
    };
  }

  const url = `${API_BASE}/${path}`;
  try {
    const response = await fetch(url, {
      headers: {
        'X-Auth-Token': apiKey,
      },
    });
    const text = await response.text();
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Cache-Control': 'no-store',
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Upstream fetch failed.' }),
    };
  }
};
