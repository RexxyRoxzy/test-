import type { NextApiRequest, NextApiResponse } from 'next';

// Replace these with your real values!
const CLIENT_ID = '1436708219249754114';
const CLIENT_SECRET = 'UZrWXVxcYYbNcNzA0NAn2tkjqeW1e2Dq'; // GET THIS FROM DISCORD DEVELOPER PORTAL
const REDIRECT_URI = 'https://test-panel-seven.vercel.app/api/callback';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const code = req.query.code as string;
    if (!code) return res.status(400).send('No code provided');

    // 1. Exchange code for access token
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
      console.error('Token exchange error:', errorData);
      return res.status(500).json({ error: 'Token exchange failed', details: errorData });
    }
    const tokenData = await tokenRes.json();

    // 2. Use access token to get Discord profile
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    if (!userRes.ok) {
      const errorData = await userRes.json();
      console.error('User profile error:', errorData);
      return res.status(500).json({ error: 'Fetching user profile failed', details: errorData });
    }
    const user = await userRes.json();

    // 3. Build avatar URL (if user has avatar)
    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : 'https://cdn.discordapp.com/embed/avatars/0.png';

    // 4. Redirect with info in query string (or use cookie/session for real apps!)
    return res.redirect(`/?username=${encodeURIComponent(user.username)}&avatar=${encodeURIComponent(avatarUrl)}`);
  } catch (error) {
    console.error('API callback error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: String(error) });
  }
}
