"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      alert("Login successful!");
      router.push("/dashboard");

    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("Account not found. Please sign up first.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError(err.message);
      }
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-bold text-center">Login to Vibra</h2>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* ✅ Form Prevents Refresh */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Login with Google
        </button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-600 font-semibold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
