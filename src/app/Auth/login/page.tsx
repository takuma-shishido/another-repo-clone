"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // 追加
  const [message, setMessage] = useState("");
  const [isSignup, setIsSignup] = useState(false); // ログイン・サインアップの切り替え

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5001/unity");
    ws.onopen = () => console.log("✅ WebSocket に接続しました");
    ws.onmessage = (event) => {
      console.log("📩 Unity からのメッセージ:", event.data);
      setMessage(event.data);
    };
    ws.onerror = (error) => console.error("🚨 WebSocket エラー:", error);
    ws.onclose = () => console.log("🔌 WebSocket が切断されました");

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  // ログイン情報送信
  const sendLoginInfoToUnity = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const loginData = JSON.stringify({ type: "login", username, password });
      socket.send(loginData);
      console.log("📤 Unity にログイン情報を送信しました:", loginData);
    } else {
      console.error("⚠️ WebSocket が接続されていません");
    }
  };

  // サインアップ情報送信
  const sendSignupInfoToUnity = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const signupData = JSON.stringify({ type: "signup", username, password, email });
      socket.send(signupData);
      console.log("📤 Unity にサインアップ情報を送信しました:", signupData);
    } else {
      console.error("⚠️ WebSocket が接続されていません");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Unity WebSocket {isSignup ? "サインアップ" : "ログイン"}</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="block w-full p-2 border"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block w-full p-2 border mt-2"
      />

      {isSignup && (
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full p-2 border mt-2"
        />
      )}

      <button
        onClick={isSignup ? sendSignupInfoToUnity : sendLoginInfoToUnity}
        className="bg-blue-500 text-white px-4 py-2 mt-4"
      >
        {isSignup ? "Unity にサインアップ情報を送信" : "Unity にログイン情報を送信"}
      </button>

      <button
        onClick={() => setIsSignup(!isSignup)}
        className="text-blue-500 underline mt-4 block"
      >
        {isSignup ? "ログインへ切り替え" : "サインアップへ切り替え"}
      </button>

      {message && <p className="mt-4 text-green-500">Unity からのメッセージ: {message}</p>}
    </div>
  );
}
