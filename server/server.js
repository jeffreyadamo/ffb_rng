import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import { XMLParser } from 'fast-xml-parser';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());

// Load tokens from .env if present
let accessToken = process.env.YAHOO_ACCESS_TOKEN || null;
let refreshToken = process.env.YAHOO_REFRESH_TOKEN || null;

// Helper: persist tokens to .env (overwrite old values)
function saveTokens(newAccessToken, newRefreshToken) {
  let envContent = fs.readFileSync('.env', 'utf8')
    .split('\n')
    .filter(line => !line.startsWith('YAHOO_ACCESS_TOKEN=') && !line.startsWith('YAHOO_REFRESH_TOKEN='))
    .join('\n');

  envContent += `\nYAHOO_ACCESS_TOKEN=${newAccessToken}`;
  if (newRefreshToken) {
    envContent += `\nYAHOO_REFRESH_TOKEN=${newRefreshToken}`;
  }
  fs.writeFileSync('.env', envContent);
}

// Helper: refresh access token using refresh_token
async function refreshAccessToken() {
  if (!refreshToken) return null;

  const tokenUrl = 'https://api.login.yahoo.com/oauth2/get_token';
  const body = new URLSearchParams({
    client_id: process.env.YAHOO_CLIENT_ID,
    client_secret: process.env.YAHOO_CLIENT_SECRET,
    redirect_uri: 'https://phthisical-clinton-downless.ngrok-free.dev/auth/callback',
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const data = await response.json();
  if (data.access_token) {
    accessToken = data.access_token;
    if (data.refresh_token) refreshToken = data.refresh_token;
    saveTokens(accessToken, refreshToken);
    console.log('Refreshed access token');
    return accessToken;
  } else {
    console.error('Failed to refresh token:', data);
    return null;
  }
}

// Step 1: Redirect to Yahoo OAuth
app.get('/auth/yahoo', (req, res) => {
  const clientId = process.env.YAHOO_CLIENT_ID;
  const redirectUri = encodeURIComponent('https://phthisical-clinton-downless.ngrok-free.dev/auth/callback');
  const url = `https://api.login.yahoo.com/oauth2/request_auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
  console.log('Redirecting to:', url);
  res.redirect(url);
});

// Step 2: Handle OAuth callback and exchange code for tokens
app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  const clientId = process.env.YAHOO_CLIENT_ID;
  const clientSecret = process.env.YAHOO_CLIENT_SECRET;
  const redirectUri = 'https://phthisical-clinton-downless.ngrok-free.dev/auth/callback';

  const tokenUrl = 'https://api.login.yahoo.com/oauth2/get_token';
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    code,
    grant_type: 'authorization_code',
  });

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const data = await response.json();
    accessToken = data.access_token;
    refreshToken = data.refresh_token;
    console.log('Access token:', accessToken);
    console.log('Refresh token:', refreshToken);

    saveTokens(accessToken, refreshToken);

    res.send('Authenticated! You can now call Yahoo Fantasy API.');
  } catch (err) {
    console.error('OAuth error:', err);
    res.status(500).send('OAuth error');
  }
});

// Step 3: Call Yahoo Fantasy API directly
app.get('/api/league', async (req, res) => {
  if (!accessToken) {
    return res.status(401).send('Not authenticated');
  }

  const leagueKey = 'nfl.l.194173'; // Replace with your actual league key
  const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}`;

  try {
    let response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // If token expired, refresh and retry
    if (response.status === 401) {
      console.log('Access token expired, refreshing...');
      await refreshAccessToken();
      response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    }

    const xml = await response.text();

    // ✅ Parse XML into JSON
    const parser = new XMLParser({ ignoreAttributes: false });
    const json = parser.parse(xml);

    res.json(json);
  } catch (err) {
    console.error('League fetch error:', err);
    res.status(500).send('Failed to fetch league data');
  }
});

// Step 4: Call Yahoo Fantasy API for teams
app.get('/api/teams', async (req, res) => {
  if (!accessToken) {
    return res.status(401).send('Not authenticated');
  }

  const leagueKey = 'nfl.l.194173'; // Replace with your actual league key
  const url = `https://fantasysports.yahooapis.com/fantasy/v2/league/${leagueKey}/teams`;

  try {
    let response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // If token expired, refresh and retry
    if (response.status === 401) {
      console.log('Access token expired, refreshing...');
      await refreshAccessToken();
      response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    }

    const xml = await response.text();

    // ✅ Parse XML into JSON
    const parser = new XMLParser({ ignoreAttributes: false });
    const json = parser.parse(xml);

    res.json(json);
  } catch (err) {
    console.error('Teams fetch error:', err);
    res.status(500).send('Failed to fetch teams data');
  }
});

// Step 5: Call Yahoo Fantasy API for a team’s roster
app.get('/api/roster/:teamId', async (req, res) => {
  if (!accessToken) {
    return res.status(401).send('Not authenticated');
  }

  const { teamId } = req.params;
  const leagueKey = 'nfl.l.194173'; // Replace with your actual league key
  const teamKey = `${leagueKey}.t.${teamId}`; // Yahoo team key format

  const url = `https://fantasysports.yahooapis.com/fantasy/v2/team/${teamKey}/roster`;

  try {
    let response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // If token expired, refresh and retry
    if (response.status === 401) {
      console.log('Access token expired, refreshing...');
      await refreshAccessToken();
      response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    }

    const xml = await response.text();

    // ✅ Parse XML into JSON
    const parser = new XMLParser({ ignoreAttributes: false });
    const json = parser.parse(xml);

    res.json(json);
  } catch (err) {
    console.error('Roster fetch error:', err);
    res.status(500).send('Failed to fetch roster data');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});