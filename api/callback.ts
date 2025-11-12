// pages/api/callback.ts

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;
  if (!code) return res.status(400).send("No code provided");

  const params = new URLSearchParams();
  params.append('client_id', '1436708219249754114');
  params.append('client_secret', 'UZrWXVxcYYbNcNzA0NAn2tkjqeW1e2Dq');
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', 'https://test-panel-seven.vercel.app/api/callback');
  params.append('scope', 'identify guilds email');

  // 1. Exchange code for token
  const discordRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  const token = await discordRes.json();

  // 2. Fetch user info with access_token
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${token.access_token}` }
  });
  const user = await userRes.json();

  // 3. Now you have user info (including avatar)
  // Pass this to the front-end however you want (session/cookie/redirect with data, etc.)
  // For now, just redirect with query string
  res.redirect(`/dashboard?username=${user.username}&avatar=${user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : '/default.png'}`);
}
