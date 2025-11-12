import React, { useEffect, useState } from "react";

// SVG Discord Logo as a React component
const DiscordLogo: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 245 240" fill="none">
    <circle cx="122.5" cy="120" r="120" fill="#5865F2"/>
    <path fill="#fff" d="M104 154c-6-2-12-4-18-7l3 6s-15-8-27-23c0 0-11-20-12-40 0-18 6-36 6-36s11-7 36-12l3 6c-16 3-26 8-26 8s4 31 19 45c0 0 13 8 31 10 18-2 31-10 31-10 15-14 19-45 19-45s-10-5-26-8l3-6c25 5 36 12 36 12s6 18 6 36c-1 20-12 40-12 40-12 15-27 23-27 23l3-6c-6 3-12 5-18 7z"/>
    <ellipse cx="98" cy="124" rx="8" ry="9" fill="#5865F2"/>
    <ellipse cx="148" cy="124" rx="8" ry="9" fill="#5865F2"/>
  </svg>
);

const DISCORD_CLIENT_ID = "1436708219249754114";
const REDIRECT_URI = "https://test-panel-seven.vercel.app/api/callback";
const AUTH_URL = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identify guilds email`;

type PageStep = "login" | "loading" | "connected";

const Home: React.FC = () => {
  const [step, setStep] = useState<PageStep>("login");
  const [avatar, setAvatar] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("code")) {
      setStep("loading");
      // Simulate backend call ~ you'll want to call your real API here
      setTimeout(() => {
        // Static example image, replace with Discord user avatar from backend!
        setAvatar("https://cdn.discordapp.com/embed/avatars/0.png");
        setStep("connected");
      }, 1800);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "linear-gradient(135deg, #5865f2 0%, #5865f2 35%, #48B1BF 100%)",
        overflow: "hidden",
        fontFamily: "Segoe UI, sans-serif",
        position: "relative",
      }}
    >
      {/* Animated shimmer background effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background:
            "radial-gradient(at 80% 20%, rgba(0,0,0,0.07), transparent 85%), radial-gradient(at 20% 70%, rgba(255,255,255,0.06), transparent 65%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Discord login card */}
      <div
        style={{
          background: "rgba(255,255,255,0.10)",
          borderRadius: 24,
          padding: 48,
          boxShadow: "0 8px 32px 0 rgba(22, 33, 68, 0.30)",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          maxWidth: 350,
          width: "100%",
        }}
      >
        <DiscordLogo />
        <h1
          style={{
            marginTop: 18,
            letterSpacing: -2,
            color: "#fff",
            fontSize: 34,
            fontWeight: 800,
            textShadow: "0 1px 10px #5865f211",
          }}
        >
          Login with Discord
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.86)",
            marginBottom: 28,
            fontWeight: 500,
          }}
        >
          Connect to access your dashboard!
        </p>

        {step === "login" && (
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              background: "linear-gradient(90deg, #5865F2 0%, #4857BF 100%)",
              color: "#fff",
              fontWeight: 700,
              border: "none",
              padding: "14px 36px",
              fontSize: 18,
              borderRadius: 16,
              cursor: "pointer",
              boxShadow: "0 2px 14px #5865f233",
            }}
            onClick={() => (window.location.href = AUTH_URL)}
          >
            <svg
              style={{ marginRight: 8 }}
              width="26"
              height="26"
              viewBox="0 0 245 240"
              fill="none"
            >
              <circle cx="122.5" cy="120" r="120" fill="#fff" />
              <path
                fill="#5865F2"
                d="M104 154c-6-2-12-4-18-7l3 6s-15-8-27-23c0 0-11-20-12-40 0-18 6-36 6-36s11-7 36-12l3 6c-16 3-26 8-26 8s4 31 19 45c0 0 13 8 31 10 18-2 31-10 31-10 15-14 19-45 19-45s-10-5-26-8l3-6c25 5 36 12 36 12s6 18 6 36c-1 20-12 40-12 40-12 15-27 23-27 23l3-6c-6 3-12 5-18 7z"
              />
              <ellipse cx="98" cy="124" rx="8" ry="9" fill="#fff" />
              <ellipse cx="148" cy="124" rx="8" ry="9" fill="#fff" />
            </svg>
            Sign in with Discord
          </button>
        )}
        {step === "loading" && (
          <div style={{ margin: "40px 0" }}>
            <div
              className="loader"
              style={{
                border: "6px solid #fff4",
                borderTop: "6px solid #5865f2",
                borderRadius: "50%",
                width: 52,
                height: 52,
                animation: "spin 0.85s linear infinite",
                margin: "0 auto",
              }}
            />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg);}
                100% { transform: rotate(360deg);}
              }
            `}</style>
            <div
              style={{
                color: "#fff",
                fontWeight: 600,
                marginTop: 18,
              }}
            >
              Connecting...
            </div>
          </div>
        )}
        {step === "connected" && (
          <div style={{ margin: "28px 0" }}>
            <div
              style={{
                width: 74,
                height: 74,
                borderRadius: "50%",
                boxShadow: "0 2px 20px #5865f255",
                margin: "0 auto 12px auto",
                overflow: "hidden",
                border: "4px solid #fff",
              }}
            >
              <img
                src={avatar}
                style={{ width: 74, height: 74 }}
                alt="User Discord PFP"
              />
            </div>
            <div
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 20,
              }}
            >
              Connected!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
