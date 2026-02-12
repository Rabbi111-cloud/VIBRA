"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt")
    );

    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsubscribeMessages();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    await addDoc(collection(db, "messages"), {
      text: message,
      uid: user.uid,
      email: user.email,
      createdAt: serverTimestamp(),
    });

    setMessage("");
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-indigo-600">
            Vibra Community Chat
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        <div className="h-80 overflow-y-auto border p-4 rounded mb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-2 ${
                msg.uid === user?.uid ? "text-right" : "text-left"
              }`}
            >
              <p className="text-sm text-gray-500">{msg.email}</p>
              <p className="bg-indigo-100 inline-block px-3 py-2 rounded">
                {msg.text}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border px-3 py-2 rounded"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </form>

      </div>
    </div>
  );
}
