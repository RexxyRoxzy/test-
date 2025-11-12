// pages/index.tsx
import React, { useState } from "react";

const DISCORD_CLIENT_ID = "1436708219249754114";
const REDIRECT_URI = "https://your-vercel-site.com/api/callback";
const AUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify email guilds`;

const IndexPage: React.FC = () => {
  const [step, setStep] = useState<"login" | "accept" | "connected">("login");
  const [username, setUsername] = useState<string>("");

  // Simulate redirect handling for prototyping
  const handleLogin = () => {
    window.location.href = AUTH_URL;
  };

  // To be replaced with API call
  React.useEffect(() => {
    // If redirected back with code, go to "accept" and then "connected" (mock)
    if (window.location.search.includes("code=")) {
      setStep("accept");
      setTimeout(() => {
        setUsername("DiscordUser123");
        setStep("connected");

        // Here you'd POST user data to your API which stores in JSON.
        fetch("/api/store-user", {
          method: "POST",
          body: JSON.stringify({ username: "DiscordUser123", email: "user@example.com", guilds: ["Guild 1", "Guild 2"] }),
        });
      }, 1200);
    }
  }, []);

  return (
    <main style={{ padding: 40, textAlign: "center" }}>
      <h1>Test Dashboard</h1>
      {step === "login" && (
        <button onClick={handleLogin} style={{ fontSize: 22, padding: "10px 30px", borderRadius: 8 }}>
          Login with Discord
        </button>
      )}
      {step === "accept" && (
        <div>
          <h2>Bot wants to access your Discord Profile, Guilds, and Email.</h2>
          <button onClick={() => setStep("connected")} style={{ fontSize: 20, marginTop: 20 }}>
            Accept
          </button>
        </div>
      )}
      {step === "connected" && (
        <div>
          <h2>Welcome, {username}! You are now connected.</h2>
        </div>
      )}
    </main>
  );
};

export default IndexPage;
