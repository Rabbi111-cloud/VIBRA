import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // 🔐 Not logged in → redirect to login
        router.push("/login");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-lg">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Welcome to Vibra 💬
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        <p className="mb-4">
          Logged in as: <strong>{user?.email}</strong>
        </p>

        <div className="border rounded-lg p-4 bg-gray-50">
          🚀 Real-time chat coming next...
        </div>

      </div>
    </div>
  );
}
