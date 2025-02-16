// For example in pages/account/login.tsx
import React from "react";

export default function Login() {
  const handleLogin = () => {
    // Suppose we do some auth checks here, then get user ID
    const userToken = "user-123456"; // unique user ID from your system

    if (typeof window !== "undefined") {
      window.aa("setAuthenticatedUserToken", userToken);
    }

    alert("User logged in, token set!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Simulate Login</button>
    </div>
  );
}
