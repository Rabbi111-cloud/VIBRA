import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rooms] = useState(["general", "tech", "random"]);
  const [currentRoom, setCurrentRoom] = useState("general");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notification, setNotification] = useState("");
  const bottomRef = useRef(null);

  // 🔐 Protect route
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);

        await setDoc(doc(db, "onlineUsers", currentUser.uid), {
          email: currentUser.email,
          uid: currentUser.uid,
          photoURL: currentUser.photoURL || "",
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🟢 Online users
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "onlineUsers"),
      (snapshot) => {
        setOnlineUsers(snapshot.docs.map((doc) => doc.data()));
      }
    );
    return () => unsubscribe();
  }, []);

  // 💬 Real-time messages
  useEffect(() => {
    const q = query(
      collection(db, "rooms", currentRoom, "messages"),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsubscribe();
  }, [currentRoom]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const moderateMessage = async (text) => {
    const res = await fetch("/api/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    return data.flagged;
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const flagged = await moderateMessage(message);

    if (flagged) {
      setNotification("⚠ Message blocked by AI moderation.");
      setTimeout(() => setNotification(""), 3000);
      return;
    }

    await addDoc(
      collection(db, "rooms", currentRoom, "messages"),
      {
        text: message,
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL || "",
        createdAt: serverTimestamp(),
      }
    );

    setMessage("");
  };

  const handleLogout = async () => {
    await deleteDoc(doc(db, "onlineUsers", user.uid));
    await signOut(auth);
    router.push("/login");
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">

      {/* Sidebar */}
      <div className="md:w-60 bg-gray-800 p-4">
        <h2 className="text-lg font-bold mb-4">Rooms</h2>

        {rooms.map((room) => (
          <button
            key={room}
            onClick={() => setCurrentRoom(room)}
            className={`block w-full text-left px-3 py-2 rounded mb-2 ${
              currentRoom === room
                ? "bg-indigo-600"
                : "hover:bg-gray-700"
            }`}
          >
            # {room}
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 w-full py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col bg-gray-700">

        <div className="p-4 border-b border-gray-600 font-semibold">
          # {currentRoom}
        </div>

        {notification && (
          <div className="bg-yellow-500 text-black p-2 text-center">
            {notification}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-3 items-start">
              <img
                src={msg.photoURL || "/default-avatar.png"}
                className="w-8 h-8 rounded-full"
                alt="avatar"
              />
              <div>
                <div className="text-sm opacity-70">
                  {msg.email} • {formatTime(msg.createdAt)}
                </div>
                <div className="bg-gray-600 p-3 rounded-lg">
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        <form
          onSubmit={sendMessage}
          className="p-4 flex gap-2 border-t border-gray-600"
        >
          <input
            className="flex-1 px-3 py-2 rounded bg-gray-800"
            placeholder="Type message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="bg-indigo-600 px-5 rounded">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
