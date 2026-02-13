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
  const bottomRef = useRef(null);

  // 🔐 Protect route
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);

        // Mark user online
        await setDoc(doc(db, "onlineUsers", currentUser.uid), {
          email: currentUser.email,
          uid: currentUser.uid,
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🟢 Listen to online users
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "onlineUsers"),
      (snapshot) => {
        setOnlineUsers(
          snapshot.docs.map((doc) => doc.data())
        );
      }
    );
    return () => unsubscribe();
  }, []);

  // 💬 Real-time messages per room
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

  // 🧠 Simple Toxicity Detection
  const containsToxicity = (text) => {
    const bannedWords = ["hate", "stupid", "idiot"];
    return bannedWords.some((word) =>
      text.toLowerCase().includes(word)
    );
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (containsToxicity(message)) {
      alert("⚠ Please use respectful language.");
      return;
    }

    await addDoc(
      collection(db, "rooms", currentRoom, "messages"),
      {
        text: message,
        email: user.email,
        uid: user.uid,
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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-900 text-white">

      {/* Sidebar */}
      <div className="w-60 bg-gray-800 p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-4">Rooms</h2>

        {rooms.map((room) => (
          <button
            key={room}
            onClick={() => setCurrentRoom(room)}
            className={`text-left px-3 py-2 rounded mb-2 ${
              currentRoom === room
                ? "bg-indigo-600"
                : "hover:bg-gray-700"
            }`}
          >
            # {room}
          </button>
        ))}

        <div className="mt-auto">
          <p className="text-sm mb-2">
            {user.email}
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-500 w-full py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-gray-700">

        <div className="p-4 border-b border-gray-600 font-semibold">
          # {currentRoom}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-xs ${
                msg.uid === user.uid
                  ? "ml-auto bg-indigo-600"
                  : "bg-gray-600"
              } p-3 rounded-lg`}
            >
              <p className="text-xs opacity-70">
                {msg.email}
              </p>
              <p>{msg.text}</p>
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
            onChange={(e) =>
              setMessage(e.target.value)
            }
          />
          <button className="bg-indigo-600 px-5 rounded">
            Send
          </button>
        </form>
      </div>

      {/* Online Users */}
      <div className="w-60 bg-gray-800 p-4">
        <h2 className="font-bold mb-3">
          🟢 Online Users
        </h2>
        {onlineUsers.map((u) => (
          <p key={u.uid} className="text-sm mb-2">
            {u.email}
          </p>
        ))}
      </div>
    </div>
  );
}
