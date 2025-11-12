import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const code = req.query.code as string;
    if (!code) return res.status(400).send("No code provided");

    const params = new URLSearchParams();
    params.append('client_id', '1436708219249754114');
    params.append('client_secret', 'UZrWXVxcYYbNcNzA0NAn2tkjqeW1e2Dq'); // <--- put your secret here
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', 'https://test-panel-seven.vercel.app/api/callback');
    params.append('scope', 'identify guilds email');

    // Exchange code for token
    const discordRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (!discordRes.ok) {
      const errorData = await discordRes.json();
      console.error('Discord token error', errorData);
      return res.status(500).json({ error: 'Discord token exchange failed', details: errorData });
    }

    const token = await discordRes.json();

    // Get user info
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${token.access_token}` }
    });

    if (!userRes.ok) {
      const errorData = await userRes.json();
      console.error('Discord user fetch error', errorData);
      return res.status(500).json({ error: 'Discord user fetch failed', details: errorData });
    }

    const user = await userRes.json();

    // Build avatar URL
    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
      : 'https://cdn.discordapp.com/embed/avatars/0.png';

    // Redirect to dashboard with avatar in query params (you can use cookies/JWT for security instead)
    return res.redirect(`/dashboard?username=${user.username}&avatar=${encodeURIComponent(avatarUrl)}`);
  } catch (error) {
    console.error('Callback error', error);
    res.status(500).json({ error: 'Internal Server Error', details: error });
  }
}
