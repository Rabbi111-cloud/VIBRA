import { useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      alert("Signup successful! Please login.");

      // 🔥 Redirect to login page
      router.push("/login");

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);

      alert("Signup successful! Please login.");

      router.push("/login");

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg space-y-4">
      <h2 className="text-2xl font-bold text-center">Create Account</h2>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border px-3 py-2 rounded-lg"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border px-3 py-2 rounded-lg"
      />

      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        {loading ? "Creating..." : "Sign Up"}
      </button>

      <button
        onClick={handleGoogleSignup}
        disabled={loading}
        className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
      >
        Sign Up with Google
      </button>
    </div>
  );
}
