import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔒 Protect route + add to online users
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/");
      } else {
        setUser(currentUser);

        // Add/update user in onlineUsers collection
        await setDoc(doc(db, "onlineUsers", currentUser.uid), {
          email: currentUser.email,
          photoURL: currentUser.photoURL || "",
          lastActive: new Date(),
        });

        setLoading(false);
      }
    });

    // 👀 Listen to online users in real-time
    const unsubscribeSnapshot = onSnapshot(
      collection(db, "onlineUsers"),
      (snapshot) => {
        const users = snapshot.docs.map((doc) => doc.data());
        setOnlineUsers(users);
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, [router]);

  // 🚪 Logout
  const handleLogout = async () => {
    if (!user) return;

    await deleteDoc(doc(db, "onlineUsers", user.uid));
    await signOut(auth);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-indigo-600 text-white">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">
            Vibra Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Logged-in User */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Your Profile
          </h2>

          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-gray-500">
                Signed in with Google
              </p>
            </div>
          </div>
        </div>

        {/* Online Users */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Online Users ({onlineUsers.length})
          </h2>

          <div className="space-y-3">
            {onlineUsers.map((onlineUser, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                {onlineUser.photoURL ? (
                  <img
                    src={onlineUser.photoURL}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                    {onlineUser.email?.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="font-medium">
                  {onlineUser.email}
                </span>

                <span className="ml-auto text-green-500 text-sm">
                  ● Online
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
