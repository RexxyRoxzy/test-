import type { NextApiRequest, NextApiResponse } from 'next';

const CLIENT_ID = '1436708219249754114';
const CLIENT_SECRET = 'UZrWXVxcYYbNcNzA0NAn2tkjqeW1e2Dq'; // REPLACE THIS!
const REDIRECT_URI = 'https://test-panel-seven.vercel.app/api/callback'; // NO .ts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const code = req.query.code as string;
    if (!code) return res.status(400).send('No code provided');

    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', REDIRECT_URI);

    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (!tokenRes.ok) {
      const errorData = await tokenRes.json();
      console.error('Token error:', errorData);
      return res.status(500).json({ error: 'Token exchange failed', details: errorData });
    }

    const tokenData = await tokenRes.json();

    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    if (!userRes.ok) {
      const errorData = await userRes.json();
      console.error('User error:', errorData);
      return res.status(500).json({ error: 'User fetch failed', details: errorData });
    }

    const user = await userRes.json();
    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : 'https://cdn.discordapp.com/embed/avatars/0.png';

    // Redirect back with user data
    return res.redirect(`/?username=${encodeURIComponent(user.username)}&avatar=${encodeURIComponent(avatarUrl)}&id=${user.id}`);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: String(error) });
  }
}
